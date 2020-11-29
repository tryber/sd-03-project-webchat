const { messagesModel } = require('../models');

const saveMessages = async ({ message }) => {
  await messagesModel.saveMessages({ message });

  return { status: 'success' };
};

const getPreviousMessages = async () => messagesModel.getPreviousMessages();

module.exports = {
  saveMessages,
  getPreviousMessages,
};
