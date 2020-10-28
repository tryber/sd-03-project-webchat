const messageServices = require('../services/messageServices');
const formatData = require('../utils/dateFormat');

const sendMessage = async (io, data) => {
  const { chatMessage, nickname, color = 'salmon' } = data;

  const { date } = await messageServices.addMessages(nickname, chatMessage, color);

  io.emit('message', `${nickname},${chatMessage}, ${formatData(date)}, ${color}`);

  // res.status(200).json({ chatMessage, nickname, color });
};

module.exports = {
  sendMessage,
};
