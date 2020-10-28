const model = require('../model/model');

const saveMessageService = async (message, timestamp) =>
  model.saveMessage(message, timestamp);

const getAllMessagesService = async () => model.getAllMessages();

module.exports = {
  saveMessageService,
  getAllMessagesService,
};
