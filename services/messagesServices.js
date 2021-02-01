const { messagesModel } = require('../models');

const saveMessages = async ({ message }) => {
  try {
    const newMessage = await messagesModel.save({ message });
    const { _id: id } = newMessage;
    return { status: 'success', insertedId: id };
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
