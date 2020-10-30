const moment = require('moment');
const messageModel = require('../model/messageModel');

const formatAndInsert = async ({ nickname, chatMessage }, socket) => {
  const currTime = moment().format('D-M-yyyy hh:mm:ss');
  console.log(currTime);
  socket.emit('message', `(${currTime}) - ${nickname}: ${chatMessage}`);
  messageModel.insertNew({ nickname, chatMessage, currTime });
};

const getAll = async (socket) => {
  socket.emit('loadHistory', await messageModel.getChatHistory());
};

module.exports = {
  formatAndInsert,
  getAll,
};
