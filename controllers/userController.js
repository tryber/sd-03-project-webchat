const userServices = require('../services/userService');

const deleteUserById = async (ioServer, id) => {
  const { nickname } = await userServices.deleteUserById(id);
  ioServer.emit('userLeft', { nickname, id });
};

const registerUser = async (ioServer, socket, data) => {
  const { nickname = 'Usuário', color = 'black' } = data;
  const id = await userServices.createUser(nickname, color);
  socket.emit('createdUser', { id });
  ioServer.emit('joinedUser', { id, nickname });
  socket.on('disconnect', () => deleteUserById(ioServer, id));
};

const updateNickname = async (ioServer, data) => {
  const { id, nickname } = data;
  const { id: userId, nickname: username } = await userServices.updateNickname(id, nickname);
  ioServer.emit('userChangedNickName', { id: userId, nickname: username });
};

module.exports = {
  registerUser,
  deleteUserById,
  updateNickname,
};
