const connection = require('./connection');

const addMessages = async (nickname, chatMessage) => {
  const date = new Date();
  return connection()
    .then((db) => db
      .collection('messages')
      .insertOne({ nickname, chatMessage, date }))
    .then((insertedId) => ({ id: insertedId, nickname, chatMessage, date }))
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
