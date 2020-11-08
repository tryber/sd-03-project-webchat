const connection = require('./connect');

const saveMessage = async (nickname, chatMessage, novaData) => connection()
  .then((db) => db.collection('mensagens').insertOne({ nickname, chatMessage, novaData }))
  .then(({ insertedId }) => ({ _id: insertedId, nickname, chatMessage, novaData }));

const allMessage = async () => (
  connection().then((db) => db.collection('mensagens').find().toArray()));

module.exports = { saveMessage, allMessage };
