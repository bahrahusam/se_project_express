const { getUsers, createUser } = require("../controllers/users");

const router = require("express").Router();

router.get("/", getUsers);
router.get("/:userId", console.log("yes"));
router.post("/", createUser);

module.exports = router;
