const { onMessage, onConnect } = require('./messages');
const { onChangeName } = require('./name');

module.exports = (Services) => (io) => (socket) => {
  onConnect(socket, Services);
  // io.emit('addOnlineUsers', nickname);

  socket.on('message', onMessage(io, Services));

  socket.on('changeNickname', onChangeName(socket, Services));

  socket.on('disconnect', () => Services.Users.remove(socket.id));
};
