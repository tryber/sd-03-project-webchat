const onMessage = (io, { Messages }) => async ({ chatMessage, nickname }) => {
  const message = await Messages.saveMessages({ chatMessage, nickname });
  const formated = Messages.formatMessages(message);
  io.emit('message', formated);
};

const onConnect = async (socket, { Messages }) => {
  const allMessages = await Messages.takeAll();
  const messages = Messages.formatMessages(allMessages);
  socket.emit('lastMessages', messages);
};

module.exports = {
  onMessage,
  onConnect,
};
