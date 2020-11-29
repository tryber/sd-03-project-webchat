const connect = require('./connection');

const saveMessages = async ({ message }) => connect()
  .then((db) => db
    .collection('messages')
    .insertOne({ message }));

const getPreviousMessages = async () => connect()
  .then((db) => db
    .collection('messages')
    .find({}).toArray());

module.exports = {
  saveMessages,
  getPreviousMessages,
};
