const { onMessage } = require('./messages');

module.exports = (Services) => (io) => (socket) => {
  socket.on('message', onMessage(io, Services));
};
