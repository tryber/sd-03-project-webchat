const { onMessage } = require('./messages');
const { onChangeName } = require('./name');

module.exports = (Services) => (io) => (socket) => {
  // io.emit('addOnlineUsers', nickname);
  socket.on('message', onMessage(io, Services));

  socket.on('changeNickname', onChangeName(io, Services));
};
