const connection = require('../tests/helpers/db');

const getAllmessages = async () => (
  connection().then((db) => (db).collection('messages').find({}).toArray())
);

const saveMessage = async (time, date, chatMessage, nickname) => (
  connection()
    .then((db) => (
      db.collection('messages').insertOne({ time, date, chatMessage, nickname })))
    .then(() => ({
      time,
      date,
      chatMessage,
      nickname,
    }))
);

module.exports = {
  getAllmessages,
  saveMessage,
};
