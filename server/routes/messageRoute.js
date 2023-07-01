const express = require("express");

const MessageModel = require("../models/messageModel.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { chatId, senderId, text, image } = req.body;

  const message = new MessageModel({ chatId, senderId, text, image });

  try {
    const result = await message.save();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
