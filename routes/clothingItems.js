const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");


router.get("/", getItems);

// POST /items — create a new item
router.post("/", createItem);

// DELETE /items/:itemId — delete an item by _id
router.delete("/:itemId", deleteItem);

// put like item
router.put("/:itemId/likes", likeItem);

// delete like from item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
