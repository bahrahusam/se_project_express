const router = require("express").Router();

router.get("/", () => console.log("GET Users"));
router.get("/:userId", () => console.log("GET Users by ID"));
router.post("/", () => console.log("POST Users"));

module.exports= router;