const handleNotificationEvent = (io, notifications) => async (text) => {
  const { chatMessage, nickname } = text;
  const timestamp = new Date();
  await notifications.saveMessageService({ chatMessage, nickname, timestamp });
  io.emit('message', text);
};

const handleNameChangeEvent = (socket, usersList) => async (text) => {
  usersList.splice(usersList.indexOf(socket), 1);
  usersList.push(text.newNickname);
  socket.broadcast.emit('nameChange', { newNickname: usersList });
  socket.emit('nameChange', { newNickname: usersList });
};

module.exports = {
  handleNotificationEvent,
  handleNameChangeEvent,
};
