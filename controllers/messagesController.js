const { messagesServices } = require('../services');

const saveMessages = async (req, res) => {
  try {
    const { message } = req.body;

    await messagesServices.saveMessages({ message });

    return res.status(204).end();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMessages = async (_req, res) => {
  try {
    const messages = await messagesServices.getMessages();

    return res.status(200).json(messages);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  saveMessages,
  getMessages,
};
