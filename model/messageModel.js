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
  return db.collection('sessionMessages').find().toArray();
};

module.exports = {
  getHistory,
  registerMessage,
};
