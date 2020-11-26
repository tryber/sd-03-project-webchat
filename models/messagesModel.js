const connection = require('./connection');

const store = async (messageObject) => connection()
  .then((db) => db.collection('messages').insertOne(messageObject));

const getAll = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .then((messages) => messages.map((msgObject) => {
    const { username, message, sentTime } = msgObject;
    return { username, message, sentTime };
  }));

module.exports = { store, getAll };
