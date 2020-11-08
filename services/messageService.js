const messageModel = require('../model/messageModel');

const saveMessage = async (user, message, date) =>
  messageModel.saveMessage(user, message, date);

const getHistory = async () => {
  const history = await messageModel.getHistory();

  return history.map(
    ({ user, message, date }) => `${date} - ${user}: ${message}`,
  );
};

module.exports = {
  saveMessage,
  getHistory,
};
