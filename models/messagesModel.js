const connect = require('./connection');

const saveMessages = async ({ message }) => connect()
  .then((db) => db
    .collection('messages')
    .insertOne({ message }));

const msgHistory = async () => connect()
  .then((db) => db
    .collection('messages')
    .find({}).toArray());

module.exports = {
  saveMessages,
  msgHistory,
};
