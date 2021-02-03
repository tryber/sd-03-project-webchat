const express = require('express');

const router = express.Router();
const Message = require('../models/messagesModel');

const getAllMessages = async (req, res) => {
  const { room } = req.body;
  const messages = await Message.find({ room });
  return res.json({ messages }).status(200);
};

const createMessage = async (req, res) => {
  const { message, nick, date, room } = req.body.newMsg;
  const newMsg = await Message.create({ message, nick, date, room });
  return res.json(newMsg).status(201);
};

router.get('/', getAllMessages);
router.post('/', createMessage);

module.exports = router;
