const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).send(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      // Email duplicate key error
      next(new ConflictError("Email already exists"));
    } else if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data for creating user"));
    } else {
      next(err); // Pass other errors to centralized error handler
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findUserByCredentials(email, password);

    // If no user found, findUserByCredentials should throw, but just in case:
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    // If error message indicates bad credentials, map to UnauthorizedError
    if (err.message === "Incorrect email or password") {
      next(new UnauthorizedError("Invalid email or password"));
    } else if (err instanceof BadRequestError) {
      next(err);
    } else {
      next(err);
    }
  }
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data for updating user"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
