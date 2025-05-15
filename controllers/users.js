const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/constants");

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).send(userResponse);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data for creating user" });
    }
    return res
      .status(DEFAULT)
      .send({ message: "An error has occurred on the server" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findUserByCredentials(email, password);

    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    // Check for incorrect email or password error
    if (err.message === "Incorrect email or password") {
      return res
        .status(UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }
    // Handle other errors with a 500 status code
    return res
      .status(DEFAULT)
      .json({ error: "An error has occurred on the server" });
  }
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "An error has occurred on the server" });
      }

      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });
};

// Update the current user that is logged in
const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true } // Return updated user and validate input
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data for updating user" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, getCurrentUser, updateUser, login };
