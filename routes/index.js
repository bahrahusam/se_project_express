const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

const {
  validateLogin,
  validateUserRegistration,
} = require("../middlewares/validation");

// Public routes with validation
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserRegistration, createUser);

// Protected resource routes
router.use("/items", clothingItemsRouter);
router.use("/users", userRouter);

module.exports = router;
