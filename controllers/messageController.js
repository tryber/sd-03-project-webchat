const rescue = require('express-rescue');

const sendMessage = (io) =>
  rescue((req) => {
    try {
      const { chatMessage, nickname } = req;

      if (!chatMessage) {
        throw new Error('Missing message');
      }

      io.emit('message', { chatMessage, nickname });
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
