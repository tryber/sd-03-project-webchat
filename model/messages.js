const connection = require('./connection');

const registerMessage = async (message) => connection()
  .then((db) => db.collection('messages').insertOne({ message }));

const retrievePublicMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = {
  registerMessage,
  retrievePublicMessages,
};
