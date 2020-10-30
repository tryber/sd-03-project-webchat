const messageModel = require('../models/messageModel');

const addMessages = async (nickname, chatMessage) => {
  const data = messageModel.addMessages(nickname, chatMessage);
  return data;
};

const getAllMessages = async () => messageModel.getAllMessages();

module.exports = {
  addMessages,
  getAllMessages,
};
