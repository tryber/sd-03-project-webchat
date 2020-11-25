const connection = require('./connection');

const registerMessage = async (message, nickname, id, time) => connection()
  .then((db) => db.collection('messages').insertOne({ _id: id, nickname, message, time }));

const retrieveMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = {
  registerMessage,
  retrieveMessages,
};
