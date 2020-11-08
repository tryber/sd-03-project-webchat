const rescue = require('express-rescue');
const userService = require('../services/userService');

const updateName = (io, socket) =>
  rescue(async (req) => {
    try {
      const { nickname, newName } = req;

      if (!newName) {
        throw new Error('Missing new name');
      }

      await userService.updateUser(nickname, newName);
      const onlineUsers = await userService.getAllOnlineUser();

      socket.emit('change-name', { newName });
      socket.broadcast.emit('someone-change-name', { nickname, newName });

      io.emit('online', { onlineUsers });
    } catch (err) {
      console.error(err);
    }
  });

const saveUser = (io, socket) =>
  rescue(async (req) => {
    try {
      const { nickname } = req;

      await userService.saveUser(nickname);
      const onlineUsers = await userService.getAllOnlineUser();

      socket.emit('self-join', { nickname });
      socket.broadcast.emit('joined', { nickname });

      io.emit('online', { onlineUsers });
    } catch (err) {
      console.error(err);
    }
  });

const removeUser = (io) =>
  rescue(async (req) => {
    try {
      console.log('removeUser', req);
      const { nickname } = req;

      await userService.removeUser(nickname);

      const onlineUsers = await userService.getAllOnlineUser();

      io.emit('online', { onlineUsers });
    } catch (err) {
      console.error(err);
    }
  });

const getUserController = (io, socket) => ({
  updateName: updateName(io, socket),
  saveUser: saveUser(io, socket),
  removeUser: removeUser(io),
});

module.exports = {
  getUserController,
};
