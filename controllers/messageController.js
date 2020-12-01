const messageModel = require('../models/messageModel');

const newMessage = (io) => async ({ nickname, chatMessage, room = 'public' }) => {
  const date = new Date();
  const dayMonthYear = new Intl.DateTimeFormat('pt-BR').format(date).replace(/\//g, '-');
  const hours = date.toLocaleTimeString('pt-BR');
  const message = `${nickname}, ${chatMessage}, ${dayMonthYear}, ${hours}, ${room}`;
  await messageModel.addMessage(message, room);
  if (room !== 'public') {
    io.to(room).emit('message', message);
  } else {
    io.emit('message', message);
  }
};

const getChatHistory = async (room) => {
  const chatRoom = await messageModel.getHistory(room);
  return chatRoom.messages;
};

module.exports = {
  newMessage,
  getChatHistory,
};
