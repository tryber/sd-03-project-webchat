const { dbConnection } = require('./connection');

const insertMessage = async ({ message, nickname }) =>
  dbConnection('messages')
    .then((collection) =>
      collection
        .insertOne({ message, nickname }));

module.exports = {
  insertMessage,
};
