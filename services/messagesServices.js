const { messagesModel } = require('../models');

const saveMessages = async ({ message, nickname, date }) => {
  try {
    const newMessage = await messagesModel.save({ message, nickname, date });
    const { _id: id } = newMessage;
    return { status: 'success', insertedId: id };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMessages = async () => {
  try {
    return messagesModel.searchAllMessages();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  saveMessages,
  getMessages,
};
