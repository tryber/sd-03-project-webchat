const connection = require('./connect');

const saveMessage = async (nickname, chatMessage, datenow) => connection()
  .then((db) => db.collection('mensagens').insertOne({ nickname, chatMessage, datenow }))
  .then(({ insertedId }) => ({ _id: insertedId, nickname, chatMessage, datenow }));

const allMessage = async () => {
  connection().then((db) => db.collection('mensagens').find({}));
};

module.exports = { saveMessage, allMessage };
