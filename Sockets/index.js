const { onMessage } = require('./messages');

module.exports = (Services) => (io) => (socket) => {
  // io.emit('addOnlineUsers', nickname);
  socket.on('message', onMessage(io, Services));
};
