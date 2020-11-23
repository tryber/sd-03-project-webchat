const { messagesModel } = require('../models');

const saveMessages = async ({ message }) => {
  await messagesModel.saveMessages({ message });

  return { status: 'success' };
};

const msgHistory = async () => messagesModel.msgHistory();

module.exports = {
  saveMessages,
  msgHistory,
};
