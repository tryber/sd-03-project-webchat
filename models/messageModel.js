const connection = require('../tests/helpers/db');

const addMessage = async (message, room = 'public') => {
  const db = await connection();
  let savedMessage = await db
    .collection('messages')
    .findOneAndUpdate({ room }, { $push: { messages: message } });
  if (!savedMessage.value) {
    savedMessage = await db
      .collection('messages')
      .insertOne({ room, messages: [message] });
  }
  return savedMessage.value;
};

const getHistory = async (room = 'public') => {
  const db = await connection();
  const chatRoom = await db.collection('messages').findOne(
    { room },
  );
  return chatRoom || { messages: [] };
};

module.exports = {
  addMessage,
  getHistory,
};
