const messageModel = require('../models/messageModel');

const addMessages = async (nickname, chatMessage, color) => {
  const data = messageModel.addMessages(nickname, chatMessage, color);
  return data;
};

const getAllMessages = async () => messageModel.getAllMessages();

module.exports = {
  addMessages,
  getAllMessages,
};
