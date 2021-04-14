const connection = require('./connection');

const store = async (messageObject) => connection()
  .then((db) => db.collection('messages').insertOne(messageObject));

const getAll = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = { store, getAll };
