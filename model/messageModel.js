const connection = require('./connection');

const saveMessage = async (user, message, date) =>
  connection().then((db) =>
    db.collection('messages').insertOne({ user, message, date }));

const getHistory = async () =>
  connection().then((db) => db.collection('messages').find({}).toArray());

module.exports = {
  saveMessage,
  getHistory,
};
