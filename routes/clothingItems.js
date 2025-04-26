const router = require("express").Router();

router.get("/", () => {});

// POST /items — create a new item
router.post("/", () => {});

// DELETE /items/:itemId — delete an item by _id
router.delete("/:itemId", () => {});

module.exports = router;
