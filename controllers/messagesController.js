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

const savePrivateMessages = async (req, res) => {
  try {
    const { message, nickname, receiver, date } = req.body;

    const save = await messagesServices.saveMessages({
      message,
      nickname,
      receiver,
      date,
    });

    return res.status(200).json(save);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPrivateMessages = async (req, res) => {
  try {
    const { nickname, receiver } = req.body;
    const messages = await messagesServices.getPrivateMessages({
      nickname,
      receiver,
    });

    return res.status(200).json(messages);
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
  savePrivateMessages,
  getPrivateMessages,
  getMessages,
};
