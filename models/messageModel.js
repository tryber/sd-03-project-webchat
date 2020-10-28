const connection = require('./connection');
const formatData = require('../utils/dateFormat');

const addMessages = async (nickname, chatMessage, color) => {
  const date = new Date();
  return connection()
    .then((db) => db
      .collection('messages')
      .insertOne({ nickname, chatMessage, color, date }))
    .then((insertedId) => ({ id: insertedId, nickname, chatMessage, color, date }))
    .catch((error) => {
      console.error(error);
      return { error: true, message: error.message, stack: error.stack, date };
    });
};

const getAllMessages = async () =>
  connection()
    .then((db) => db
      .collection('messages').find({}).toArray());

module.exports = {
  addMessages,
  getAllMessages,
};
