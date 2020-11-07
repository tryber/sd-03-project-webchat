const rescue = require('express-rescue');

const updateName = (socket) =>
  rescue((req, res) => {
    try {
      const { nickname, newName } = req;

      if (!newName) {
        return res.status(422).json({ message: 'Missing new name' });
      }

      socket.emit('change-name', { newName });
      socket.broadcast.emit('someone-change-name', { nickname, newName });

      return res.status(200).end();
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
