const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,

} = require("../utils/constants");

// GET /items — returns all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send("An error has occurred on the server");
    });
};

// POST /items — creates a new item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id; // Will work once we add authentication middleware later
  console.log(owner);

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send("An error has occurred on the server");
      }
      return res.status(DEFAULT).send("An error has occurred on the server");
    });
};

// DELETE /items/:itemId — deletes an item by _id
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send("An error has occurred on the server");
      } if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send("An error has occurred on the server");
      }
      return res.status(DEFAULT).send("An error has occurred on the server");
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // only add if not already in array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove user from likes array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send("An error has occurred on the server");
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send("An error has occurred on the server");
      }
      return res.status(DEFAULT).send("An error has occurred on the server");
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
