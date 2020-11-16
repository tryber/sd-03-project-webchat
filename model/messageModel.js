const connection = require('./connection');

const registerMessage = async (nick, message, timestamp) => {
  const db = await connection();
  db.collection('sessionMessages').insertOne(
    {
      nick, message, timestamp,
    },
  );
};

module.exports = {
  registerMessage,
};
