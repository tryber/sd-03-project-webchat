const rescue = require('express-rescue');

const sendMessage = (io) =>
  rescue((req, res) => {
    try {
      const { message, nickname, date } = req;

      if (!message) {
        return res.status(422).json({ message: 'Missing message' });
      }

      io.emit('message', { message, nickname, date });

      console.log(res);
      return res.status(200).end();
    } catch (err) {
      console.error(err);
    }
  });

const getMessageController = (io) => ({
  sendMessage: sendMessage(io),
});

module.exports = {
  getMessageController,
};
