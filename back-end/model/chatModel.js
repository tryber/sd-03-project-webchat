const connection = require('./connect');

const createChat = async (nickname, message, date) =>
  connection().then((db) =>
    db.collection('message')
      .insertOne({ nickname, message, date }));

const readChat = async () => connection().then((db) => db.collection('message').find({}).toArray());

module.exports = {
  createChat,
  readChat,
};
