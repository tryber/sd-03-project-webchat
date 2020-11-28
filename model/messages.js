const connection = require('./connection');

const registerMessage = async (message) => connection()
  .then((db) => db.collection('messages').insertOne({ message }));

const retrievePublicMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

const retrievePrivateMessages = async () => connection()
  .then((db) => db.collection('messages').find({ isPublic: false }).toArray());

module.exports = {
  registerMessage,
  retrievePrivateMessages,
  retrievePublicMessages,
};
