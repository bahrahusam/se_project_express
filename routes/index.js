const router = require("express").Router();

// const { default: mongoose } = require("mongoose");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use("/items", clothingItemsRouter);
router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);

router.use("/users", userRouter);

module.exports = router;
