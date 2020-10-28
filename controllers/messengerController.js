const sendMessage = (socket, messageObject) => {
  socket.emit('messageReceived', messageObject);
};

const receiveMessage = (socket, messages) => (messageObject) => {
  messages.push(messageObject);
  socket.emit('messageReceived', messageObject);
};

module.exports = {
  sendMessage,
  receiveMessage,
};
