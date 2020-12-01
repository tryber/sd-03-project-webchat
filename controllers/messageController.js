const messageModel = require('../models/messageModel');

const newMessage = (io) => async ({ nickname, chatMessage, room = 'public' }) => {
  const sentOn = new Date();
  const sentOnDate = sentOn.toLocaleDateString('pt-BR').replace(/\//g, '-');
  const sentOnTime = sentOn.toLocaleTimeString('pt-BR');
  const message = `${nickname}, ${chatMessage}, ${sentOnDate}, ${sentOnTime}, ${room}`;
  await messageModel.saveMessage(message, room);
  if (room !== 'public') {
    io.to(room).emit('message', message);
  } else {
    io.emit('message', message);
  }
};

const getChatHistory = async (room) => {
  const chatRoom = await messageModel.getChatHistory(room);
  return chatRoom.messages;
};

module.exports = {
  newMessage,
  getChatHistory,
};
