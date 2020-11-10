let onlineUsers = [];

const saveUser = (user) => onlineUsers.push(user);

const getAllOnlineUser = () => onlineUsers;

const removeUser = (deleteUser) => {
  onlineUsers = onlineUsers.filter((user) => user !== deleteUser);
};

const updateUser = (user, newName) => {
  const indexOfUser = onlineUsers.indexOf(user);
  onlineUsers[indexOfUser] = newName;
};

module.exports = {
  saveUser,
  getAllOnlineUser,
  removeUser,
  updateUser,
};
