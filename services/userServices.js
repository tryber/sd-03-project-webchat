const userModel = require('../models/userModel');

const createUser = async (nickname, color) => {
  const { userId } = await userModel.createUser(nickname, color);
  return userId;
};

const deleteUserById = async (id) => {
  const user = await userModel.getUserBy(id);
  if (!user) return { username: 'Anônimo', color: 'black' };
  await userModel.deleteUserById(id);
  return user;
};

const getAllUsers = async () => userModel.getAllUsers();

module.exports = {
  createUser,
  deleteUserById,
  getAllUsers,
};
