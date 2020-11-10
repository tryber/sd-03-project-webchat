const rescue = require('express-rescue');
const userService = require('../services/userService');

const updateName = (io, socket) =>
  rescue((req) => {
    try {
      const { nickname, newName } = req;

      if (!newName) {
        throw new Error('Missing new name');
      }

      userService.updateUser(nickname, newName);
      const onlineUsers = userService.getAllOnlineUser();

      socket.emit('change-name', { newName });
      socket.broadcast.emit('someone-change-name', { nickname, newName });

      io.emit('online', onlineUsers);
    } catch (err) {
      console.error(err);
    }
  });

const saveUser = (io, socket) =>
  rescue((req) => {
    try {
      const { nickname } = req;
      const { id } = socket;

      userService.saveUser(nickname, id);
      const onlineUsers = userService.getAllOnlineUser();

      socket.emit('self-join', { nickname });
      socket.broadcast.emit('joined', { nickname });

      io.emit('online', onlineUsers);
    } catch (err) {
      console.error(err);
    }
  });

const removeUser = (io, socket) =>
  rescue(() => {
    try {
      const { id } = socket;

      const removedUser = userService.removeUser(id);

      const nickname = removedUser ? removedUser.nickname : 'Alguém';

      const onlineUsers = userService.getAllOnlineUser();

      socket.broadcast.emit('left-chat', { nickname });

      io.emit('online', onlineUsers);
    } catch (err) {
      console.error(err);
    }
  });

const getUserController = (io, socket) => ({
  updateName: updateName(io, socket),
  saveUser: saveUser(io, socket),
  removeUser: removeUser(io, socket),
});

module.exports = {
  getUserController,
};
