const connection = require('./connect');

const saveMessage = async (novaData, nickname, chatMessage) => connection()
  .then((db) => db.collection('messages').insertOne({ novaData, nickname, chatMessage }))
  .then(({ insertedId }) => ({ _id: insertedId, novaData, nickname, chatMessage }));

const allMessage = async () => (
  connection().then((db) => db.collection('messages').find().sort({ novaData: -1 }).toArray()));

module.exports = { saveMessage, allMessage };
