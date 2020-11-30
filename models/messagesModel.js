const { connection } = require('./connection');

const createMessage = async (chatMessage, nickname, timestamp) => connection()
  .then((db) => db.collection('recipes').insertOne({ chatMessage, nickname, timestamp }))
  .then(({ insertedId }) => ({
    message: {
      chatMessage,
      nickname,
      timestamp,
      _id: insertedId,
    },
  }));

module.exports = {
  createMessage,
};
