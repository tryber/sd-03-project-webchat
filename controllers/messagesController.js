const { messagesServices } = require('../services');

const saveMessages = async (req, res) => {
  try {
    const { message, nickname, date } = req.body;

    const save = await messagesServices.saveMessages({
      message,
      nickname,
      date,
    });

    return res.status(200).json(save);
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
