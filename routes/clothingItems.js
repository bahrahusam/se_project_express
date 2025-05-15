const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", getItems);

// POST /items — create a new item
router.post("/", auth, createItem);

// DELETE /items/:itemId — delete an item by _id
router.delete("/:itemId", auth, deleteItem);

// put like item
router.put("/:itemId/likes", auth, likeItem);

// delete like from item
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
