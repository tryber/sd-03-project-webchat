const userModel = require('../model/userModel');

const saveUser = async (user) => userModel.saveUser(user);

const getAllOnlineUser = async () => userModel.getAllOnlineUser();

const removeUser = async (user) => userModel.removeUser(user);

const updateUser = async (user, newName) => userModel.updateUser(user, newName);

module.exports = {
  saveUser,
  getAllOnlineUser,
  removeUser,
  updateUser,
};
