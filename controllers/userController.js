const rescue = require('express-rescue');

const updateName = (socket) =>
  rescue((req, _res) => {
    try {
      const { nickname, newName } = req;

      if (!newName) {
        throw new Error('Missing new name');
      }

      socket.emit('change-name', { newName });
      socket.broadcast.emit('someone-change-name', { nickname, newName });
    } catch (err) {
      console.error(err);
    }
  });

const getUserController = (io) => ({
  updateName: updateName(io),
});

module.exports = {
  getUserController,
};
