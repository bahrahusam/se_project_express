const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = require("express").Router();

//get current logged in user
router.get("/me", auth, getCurrentUser);

// Update the current logged-in user's profile
router.patch("/me", auth, updateUser);

module.exports = router;
