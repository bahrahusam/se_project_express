const router = require("express").Router();

const { default: mongoose } = require("mongoose");
const userRouter = require("./users");

router.use("/users", userRouter);

module.exports = router;