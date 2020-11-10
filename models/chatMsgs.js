const connection = require('../tests/helpers/db');

const saveChat = async (nick, msg, data) => connection()
  .then((db) => db.collection('messages').insertOne({ nick, msg, data }));

const callChat = async () => connection()
  .then((db) => db.collection('messages').find({}));

module.exports = {
  saveChat,
  callChat,
};
