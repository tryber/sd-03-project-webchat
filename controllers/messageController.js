const sendMessage = (io) => (req, res) => {
  const { message, nickname, date } = req.body;

  if (!message) {
    return res.status(422).json({ message: 'Missing message' });
  }

  io.emit('message', { message, nickname, date });

  res.status(200).json({ message: 'Message sent' });
};

const getMessageController = (io) => ({
  sendMessage: sendMessage(io),
});

module.exports = {
  getMessageController,
};
