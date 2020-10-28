// const sendNotification = (io) => (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(422).json({ message: 'Missing notification text' });
//   }

//   io.emit('notification', text);

//   res.status(200).json({ message: 'Notification sent' });
// };

const handleNotificationEvent = (io, notifications) => async (text) => {
  const { chatMessage, nickname } = text;
  const timestamp = new Date();
  await notifications.saveMessageService({ chatMessage, nickname, timestamp });
  io.emit('notification', text);
};

module.exports = {
  // sendNotification,
  handleNotificationEvent,
};
