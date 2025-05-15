const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");


// get current logged in user
router.get("/me", auth, getCurrentUser);

// Update the current logged-in user's profile
router.patch("/me", auth, updateUser);

module.exports = router;
