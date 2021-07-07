const connection = require('./connect');

const createChat = async (nickname, chatMessage, date) =>
  connection().then((db) =>
    db.collection('messages')
      .insertOne({ nickname, chatMessage, date }));

const readChat = async () => connection().then((db) => db.collection('messages').find().sort({ date: -1 }).toArray());

module.exports = {
  createChat,
  readChat,
};