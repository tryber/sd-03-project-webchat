const handleNotificationEvent = (io, notifications) => async (text) => {
  const { chatMessage, nickname } = text;
  const timestamp = new Date();
  await notifications.saveMessageService({ chatMessage, nickname, timestamp });
  io.emit('message', text);
};

const handleNameChangeEvent = (socket, usersList) => async (nameObj) => {
  const userId = nameObj.socketID;
  const userNameList = usersList;
  userNameList[userId] = nameObj.newNickname;
  socket.broadcast.emit('nameChange', { newNickname: Object.values(userNameList) });
  socket.emit('nameChange', { newNickname: Object.values(userNameList) });
};

module.exports = {
  handleNotificationEvent,
  handleNameChangeEvent,
};
