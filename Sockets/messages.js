const onMessage = (io, { Messages }) => async ({ chatMessage, nickname }) => {
  const insertion = await Messages.saveMessages({ chatMessage, nickname });
  console.log(insertion, nickname);
  const message = `${insertion.nickname} ${insertion.time} ${insertion.chatMessage}`;
  io.emit('message', message);
};

module.exports = {
  onMessage,
};
