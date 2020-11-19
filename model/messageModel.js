const connection = require('./connection');

const registerMessage = async (message) => {
  const db = await connection();
  db.collection('messages').insertOne(
    {
      message,
    },
  )
    .catch(({ status, errMessage }) => {
      throw new Error(`${status} - ${errMessage}`);
    });
};

const getHistory = async () => {
  const db = await connection();
  return db.collection('messages').find().toArray()
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

const deleteMessages = async (messageId = {}) => {
  const db = await connection();
  return db.collection('messages').deleteMany(messageId)
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

module.exports = {
  getHistory,
  registerMessage,
  deleteMessages,
};
