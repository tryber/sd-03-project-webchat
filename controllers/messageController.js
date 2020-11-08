const rescue = require('express-rescue');
const messageService = require('../services/messageService');

// Referência usada para criar a data no formato esperado:
// https://github.com/tryber/sd-03-project-webchat/pull/13/files#diff-112ac233b1e3314b31d86e70dd54fd358cf3e246c38a63bf2e3085a47a0d6cf3

const sendMessage = (io) =>
  rescue(async (req) => {
    try {
      const { chatMessage, nickname } = req;

      const date = `${new Date().getUTCDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
      const time = new Date().toLocaleTimeString('pt-BR');

      if (!chatMessage) {
        throw new Error('Missing message');
      }

      await messageService.saveMessage(
        nickname,
        chatMessage,
        `${date} ${time}`,
      );

      const message = `${date} ${time} - ${nickname}: ${chatMessage}`;

      io.emit('message', message);
    } catch (err) {
      console.error(err);
    }
  });

const getHistory = (socket) =>
  rescue(async () => {
    try {
      const history = await messageService.getHistory();

      socket.emit('history', history);
    } catch (err) {
      console.error(err);
    }
  });

const getMessageController = (io, socket) => ({
  sendMessage: sendMessage(io),
  getHistory: getHistory(socket),
});

module.exports = {
  getMessageController,
};
