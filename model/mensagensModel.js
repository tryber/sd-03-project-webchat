const connection = require('./connect');

const saveMessage = async (nickname, chatMessage, novaData) => connection()
  .then((db) => db.collection('messages').insertOne({ nickname, chatMessage, novaData }))
  .then(({ insertedId }) => ({ _id: insertedId, nickname, chatMessage, novaData }));

const allMessage = async () => (
  connection().then((db) => db.collection('messages').find().sort({ novaData: -1 }).toArray()));

module.exports = { saveMessage, allMessage };
