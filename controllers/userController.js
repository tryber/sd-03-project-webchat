const userServices = require('../services/userServices');

const deleteUserById = async (ioServer, id) => {
  const { nickname, color } = await userServices.deleteUserById(id);
  ioServer.emit('userLeft', { nickname, color, id });
};

const registerUser = async (ioServer, socket, data) => {
  const { nickname = 'Usuário', color = 'black' } = data;
  const id = await userServices.createUser(nickname, color);
  socket.emit('createdUser', { id });
  ioServer.emit('joinedUser', { id, nickname });
  socket.on('disconnect', () => deleteUserById(ioServer, id));
};

module.exports = {
  registerUser,
  deleteUserById,
};
