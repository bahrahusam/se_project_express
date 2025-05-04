const router = require("express").Router();

// const { default: mongoose } = require("mongoose");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { loginUser, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
app.post('/signin', loginUser);
app.post('/signup', createUser);

module.exports = router;
