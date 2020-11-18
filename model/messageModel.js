const connection = require('./connection');

const registerMessage = async (nickname, chatMessage, timestamp) => {
  const db = await connection();
  db.collection('sessionMessages').insertOne(
    {
      nickname, chatMessage, timestamp,
    },
  )
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

const getHistory = async () => {
  const db = await connection();
  return db.collection('sessionMessages').find().toArray()
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

const deleteMessages = async (messageId = {}) => {
  const db = await connection();
  return db.collection('sessionMessages').deleteMany(messageId)
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

module.exports = {
  getHistory,
  registerMessage,
  deleteMessages,
};
