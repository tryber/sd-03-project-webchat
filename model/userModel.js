let onlineUsers = [];

const saveUser = (nickname, socketId) =>
  onlineUsers.push({ nickname, socketId });

const getAllOnlineUser = () => onlineUsers;

const removeUser = (id) => {
  onlineUsers = onlineUsers.filter(({ socketId }) => socketId !== id);
};

const updateUser = (user, newName) => {
  onlineUsers = onlineUsers.map(({ nickname, socketId }) => {
    if (nickname === user) {
      return { nickname: newName, socketId };
    }
    return { nickname, socketId };
  });
};

module.exports = {
  saveUser,
  getAllOnlineUser,
  removeUser,
  updateUser,
};
