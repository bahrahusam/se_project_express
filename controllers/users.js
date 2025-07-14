const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const NotFoundError = require("../utils/NotFoundError");
const ConflictError = require("../utils/ConflictError");

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
      return next(new ConflictError("Email already exists"));
    }

    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data for creating user"));
    }

    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findUserByCredentials(email, password);

    // Normally this should never happen, but we check defensively.
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Invalid email or password"));
    }

    if (err instanceof BadRequestError) {
      return next(err);
    }

    return next(err); // Catch-all
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
