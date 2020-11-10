const userModel = require('../model/userModel');

const saveUser = (user) => userModel.saveUser(user);

const getAllOnlineUser = () => userModel.getAllOnlineUser();

const removeUser = (user) => userModel.removeUser(user);

const updateUser = (user, newName) => userModel.updateUser(user, newName);

module.exports = {
  saveUser,
  getAllOnlineUser,
  removeUser,
  updateUser,
};
