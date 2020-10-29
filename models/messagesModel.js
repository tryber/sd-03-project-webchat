const { dbConnection } = require('./connection');

const insertMessage = async (obj) =>
  dbConnection('messages')
    .then((collection) =>
      collection
        .insertOne(obj));

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
