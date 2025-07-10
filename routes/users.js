const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const { validateUpdateUser } = require("../middlewares/validation");

// Get the current logged-in user
router.get("/me", auth, getCurrentUser);

// Update the current logged-in user's profile
router.patch("/me", auth, validateUpdateUser, updateUser);

module.exports = router;
