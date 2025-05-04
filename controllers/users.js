
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT, CONFLICT, UNAUTHORIZED  } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => {
    return User.create({ name, avatar, email, password: hash });
  })
  .then((user) => {
    //this is to delete pass from client side
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).send(userResponse);
  })
  .catch((err) => {
    console.error(err);

    if (err.code === 11000) {
      return res.status(CONFLICT).send({ message: "Email already in use" });
    }

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
    }

    return res.status(DEFAULT).send({ message: "An error has occurred on the server" });
  });
};

// Login controller
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Use the custom method to validate credentials
  User.findUserByCredentials(email, password)
    .then((user) => {
      // Generate a JWT token with the user id, which expires in 7 days
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      // Send the token back in the response
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      // If the credentials are incorrect, return a 401 error
      res.status(UNAUTHORIZED).send({ message: "Invalid email or password" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
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

module.exports = { getUsers, createUser, getUserById, loginUser  };
