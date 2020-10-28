const onChangeName = ({ io, socket: { id } }, { Users }) => async (nickname) => {
  await Users.changeName(id, nickname);
  return io.emit('changedName', nickname);
};

const getOnlineUsers = async (socket, { Users }) => {
  const list = await Users.getAllOnline();
  return socket.emit('onlineUsers', list);
};

const createUser = async (socket, { Users }) => {
  const nickname = Users.createName();
  await Users.markAsOnline(socket.id, nickname);

  socket.broadcast.emit('addOnlineUsers', nickname);
  socket.emit('receiveNickName', nickname);
};

const removeUser = ({ io, socket: { id } }, { Users }) => async () => {
  const { nickname } = await Users.removeUser(id);
  io.emit('userDisconeted', nickname);
};

module.exports = {
  onChangeName,
  getOnlineUsers,
  createUser,
  removeUser,
};
