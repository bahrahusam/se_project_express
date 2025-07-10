const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateItemId,
} = require("../middlewares/validation");

// GET /items — fetch all items
router.get("/", getItems);

// POST /items — create a new item (with body validation)
router.post("/", auth, validateClothingItem, createItem);

// DELETE /items/:itemId — delete an item (with param validation)
router.delete("/:itemId", auth, validateItemId, deleteItem);

// PUT /items/:itemId/likes — like an item (with param validation)
router.put("/:itemId/likes", auth, validateItemId, likeItem);

// DELETE /items/:itemId/likes — unlike an item (with param validation)
router.delete("/:itemId/likes", auth, validateItemId, dislikeItem);

module.exports = router;
