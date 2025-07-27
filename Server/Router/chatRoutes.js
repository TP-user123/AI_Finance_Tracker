const express = require("express");
const { handleChat } = require("../Controller/chatController"); // ✅ correct path and curly braces
const router = express.Router();

router.post("/", handleChat);

module.exports = router;