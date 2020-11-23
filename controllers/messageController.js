const { messagesServices } = require('../services');

const saveMessages = async (req, res) => {
  const { message } = req.body;

  await messagesServices.saveMessages({ message });

  res.status(204).end();
};

const msgHistory = async (_req, res) => {
  const messages = await messagesServices.msgHistory();

  res.status(200).json(messages);
};

module.exports = {
  saveMessages,
  msgHistory,
};
