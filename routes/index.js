const router = require("express").Router();

const { default: mongoose } = require("mongoose");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

module.exports = router;
