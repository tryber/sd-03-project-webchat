const { messagesModel } = require('../models');

const saveMessages = async ({ message }) => {
  try {
    await messagesModel.saveMessages({ message });
    return { status: 'success' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMessages = async () => {
  try {
    return messagesModel.searchMessages();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  saveMessages,
  getMessages,
};
