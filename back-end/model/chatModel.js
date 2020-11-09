const connection = require('./connect');

const createChat = async (nickname, chatMessage, date) =>
  connection().then((db) =>
    db.collection('message')
      .insertOne({ nickname, chatMessage, date }));

const readChat = async () => connection().then((db) => db.collection('message').find().toArray());

module.exports = {
  createChat,
  readChat,
};
