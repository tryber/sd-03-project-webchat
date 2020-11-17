const connection = require('./connection');

const registerMessage = async (nickname, chatMessage, timestamp) => {
  const db = await connection();
  db.collection('sessionMessages').insertOne(
    {
      nickname, chatMessage, timestamp,
    },
  );
};

module.exports = {
  registerMessage,
};
