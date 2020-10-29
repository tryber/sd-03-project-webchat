const messages = require('../models/messagesModel');

const sendMessage = async (socket, messageObject) => {
  socket.emit('messageReceived', messageObject);
  const res = await messages.store(messageObject);
  return res;
};

module.exports = {
  sendMessage,
};
