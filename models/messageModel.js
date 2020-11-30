const connection = require('../tests/helpers/db');

const saveMessage = async (message) => {
  const db = await connection();
  let savedMessage = await db
    .collection('messages')
    .findOneAndUpdate({ room: 'public' }, { $push: { messages: message } });

  if (!savedMessage.value) {
    savedMessage = await db
      .collection('messages')
      .insertOne({ room: 'public', messages: [message] });
  }

  return savedMessage.value;
};

const getChatHistory = async () => {
  const db = await connection();
  const chatRoom = await db.collection('messages').findOne(
    { room: 'public' },
  );
  return chatRoom || { messages: [] };
};

module.exports = {
  saveMessage,
  getChatHistory,
};
