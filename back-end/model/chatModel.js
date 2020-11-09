const connection = require('../../tests/helpers/db');

const createChat = async (nickname, chatMessage, date) =>
  connection().then((db) =>
    db.collection('message')
      .insertOne({ nickname, chatMessage, date }));

const readChat = async () => connection().then((db) => db.collection('message').find().sort({ date: -1 }).toArray());

module.exports = {
  createChat,
  readChat,
};
