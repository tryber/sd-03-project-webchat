const { onMessage, getLastMessages } = require('./messages');
const { onChangeName, getOnlineUsers, createUser, removeUser } = require('./users');

module.exports = (Services) => (io) => async (socket) => {
  await createUser(socket, Services);
  await getLastMessages(socket, Services);
  await getOnlineUsers(socket, Services);

  socket.on('message', onMessage(io, Services));
  socket.on('changeNickname', onChangeName({ io, socket }, Services));
  socket.on('disconnect', removeUser({ io, socket }, Services));
};
