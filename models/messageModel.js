const connect = require('./connection');

const saveMessage = async (message, nickname, timestamp) =>
  connect()
    .then((db) =>
      db.collection('messages').insertOne({ message, nickname, timestamp }))
    .then(({ insertedId }) => ({
      _id: insertedId,
      message,
      nickname,
      timestamp,
    }))
    .catch((error) => error);

const getAllMessage = async () =>
  connect()
    .then((db) => db
      .collection('messages').find({}).toArray());

module.exports = { saveMessage, getAllMessage };
