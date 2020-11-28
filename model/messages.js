const connection = require('./connection');

const registerMessage = async (message, isPublic) => connection()
  .then((db) => db.collection('messages').insertOne({ message, isPublic }));

const retrievePublicMessages = async () => connection()
  .then((db) => db.collection('messages').find({ isPublic: true }).toArray());

const retrievePrivateMessages = async () => connection()
  .then((db) => db.collection('messages').find({ isPublic: false }).toArray());

module.exports = {
  registerMessage,
  retrievePrivateMessages,
  retrievePublicMessages,
};
