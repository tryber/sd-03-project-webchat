const moment = require('moment');
const messageModel = require('../model/messageModel');

const formatAndInsert = async ({ nickname, chatMessage }, socket) => {
  const currTime = moment().format('D-M-yyyy hh:mm:ss');
  socket.emit('message', `(${currTime}) - ${nickname}: ${chatMessage}`);
  messageModel.insertNew({ nickname, chatMessage, currTime });
};

const getAll = async (socket) => {
  try {
    socket.emit('loadHistory', await messageModel.getChatHistory());
  } catch (error) {
    socket.emit('message', `Erro na conexão ao banco de dados: ${error}`);
  }
};

module.exports = {
  formatAndInsert,
  getAll,
};
