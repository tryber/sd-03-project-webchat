const { onMessage } = require('./messages');

module.exports = (io) => (socket) => {
  socket.on('message', onMessage(io));
};
