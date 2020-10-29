const moment = require('moment');

const handleNotificationEvent = (socket, notifications) => async (message) => {
  const { chatMessage, nickname } = message;
  const timestamp = new Date();
  await notifications.saveMessageService({ chatMessage, nickname, timestamp });
  const time = moment(timestamp).format('D-M-yyyy hh:mm:ss');
  const messageToSend = `chatMessage: [${time}] ${nickname} disse: ${chatMessage}`;
  socket.emit('message', messageToSend);
  socket.broadcast.emit('message', messageToSend);
};

const handleNameChangeEvent = (socket, usersList) => (nameObj) => {
  const userId = nameObj.socketID;
  const userNameList = usersList;
  userNameList[userId] = nameObj.newNickname;
  socket.broadcast.emit('nameChange', { newNickname: Object.values(userNameList) });
  socket.emit('nameChange', { newNickname: Object.values(userNameList) });
};

const handleHistoryEvent = (socket, history) => {
  const messageArray = [];
  history.map((e) => {
    const { nickname, chatMessage, timestamp } = e;
    const time = moment(timestamp).format('D-M-yyyy hh:mm:ss');
    const messageToSend = `chatMessage: [${time}] ${nickname} disse: ${chatMessage}`;
    messageArray.push(messageToSend);
  });
  socket.emit('history', messageArray);
  socket.broadcast.emit('history', messageArray);
  // console.log('Histórico recebido: ', messageArray);
};

module.exports = {
  handleNotificationEvent,
  handleNameChangeEvent,
  handleHistoryEvent,
};
