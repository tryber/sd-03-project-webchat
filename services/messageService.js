const model = require('../model/model');

const saveMessageService = async (message) =>
  model.saveMessage(message);

const getAllMessagesService = async () => model.getAllMessages();

module.exports = {
  saveMessageService,
  getAllMessagesService,
};
