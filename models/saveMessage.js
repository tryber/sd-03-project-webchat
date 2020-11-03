const connect = require('./connection');

const saveMessage = async (chatMessage, nickname, timestamp) => connect()
  .then((db) => db
    .collection('webchat')
    .insertOne({ chatMessage, nickname, timestamp }))
  .then(({ insertedId }) => ({ _id: insertedId, chatMessage, nickname, timestamp }))
  .catch((error) => error);

const getAllMessages = async () => connect()
  .then((db) => db.collection('webchat').find({}).toArray())
  .catch((error) => error);

module.exports = {
  saveMessage,
  getAllMessages,
};
