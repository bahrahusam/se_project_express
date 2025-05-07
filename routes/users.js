const { getCurrentUser, updateUser } = require("../controllers/users");

const router = require("express").Router();

//get current logged in user
router.get("/me", getCurrentUser);

// Update the current logged-in user's profile
router.patch("/me", updateUser);

module.exports = router;
