const messageModel = require('../models/messageModel');

const newMessage = (io) => async ({ nickname, chatMessage }) => {
  const sentOn = new Date();
  const sentOnDate = sentOn.toLocaleDateString('pt-BR').replace(/\//g, '-');
  const sentOnTime = sentOn.toLocaleTimeString('pt-BR');
  const message = `${nickname}: ${chatMessage} - ${sentOnDate} ${sentOnTime}`;
  await messageModel.saveMessage(message);
  io.emit('message', message);
};

const getChatHistory = async () => {
  const chatRoom = await messageModel.getChatHistory();
  return chatRoom.messages;
};

module.exports = {
  newMessage,
  getChatHistory,
};
