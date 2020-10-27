const onMessage = (io, { Messages }) => async ({ chatMessage, nickname }) => {
  const message = await Messages.saveChat({ chatMessage, nickname });
  io.emit('message', message);
};

module.exports = {
  onMessage,
};
