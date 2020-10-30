const connect = require('../connect');

const insertNew = async ({ nickname, chatMessage, currTime }) => connect()
  .then((db) =>
    db
      .collection('messages')
      .insertOne(({ nickname, chatMessage, currTime })));

const getChatHistory = async () => connect()
  .then((db) =>
    db
      .collection('messages')
      .find({})
      .toArray());

module.exports = {
  insertNew,
  getChatHistory,
};
