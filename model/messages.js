const connection = require('./connection');

// TODO: implement the room key on the DB
const registerMessage = async (message, room) => connection()
  .then(
    (db) => db.collection('messages').insertOne({ message, room }),
  );

const retrieveMessages = async (room) =>
  connection().then((db) => db.collection('messages').find({ room }).toArray());

module.exports = {
  registerMessage,
  retrieveMessages,
};
