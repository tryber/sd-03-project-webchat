const { getAllMessages, formatMessage } = require('../model/messages');

async function hydrateMessages(io) {
  const messages = await getAllMessages();
  const messagesFormated = await messages.map(formatMessage);
  io.emit('history', messagesFormated);
  // messages.forEach((message) => {
  //   io.emit('message', formatMessage(message));
  // });
}

module.exports = { hydrateMessages };
