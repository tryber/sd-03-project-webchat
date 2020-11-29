const { messagesServices } = require('../services');

const saveMessages = async (req, res) => {
  const { message } = req.body;

  await messagesServices.saveMessages({ message });

  res.status(204).end();
};

const getPreviousMessages = async (_req, res) => {
  const messages = await messagesServices.getPreviousMessages();

  res.status(200).json(messages);
};

module.exports = {
  saveMessages,
  getPreviousMessages,
};
