const { dbConnection } = require('./connection');

const insertMessage = async ({ message, nickname }) =>
  dbConnection('messages')
    .then((collection) =>
      collection
        .insertOne({ message, nickname }));

const allPastMessages = async () =>
  dbConnection('messages')
    .then((collection) =>
      collection
        .find()
        .toArray());

module.exports = {
  insertMessage,
  allPastMessages,
};
