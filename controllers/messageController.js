const rescue = require('express-rescue');

// Referência usada para criar a data no formato esperado:
// https://github.com/tryber/sd-03-project-webchat/pull/13/files#diff-112ac233b1e3314b31d86e70dd54fd358cf3e246c38a63bf2e3085a47a0d6cf3

const sendMessage = (io) =>
  rescue((req) => {
    try {
      const { chatMessage, nickname } = req;

      const date = `${new Date().getUTCDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
      const time = new Date().toLocaleTimeString('pt-BR');

      if (!chatMessage) {
        throw new Error('Missing message');
      }

      const message = `${date} ${time} - ${nickname}: ${chatMessage}`;

      io.emit('message', message);
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
