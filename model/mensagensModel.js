const connection = require('./connect');

const saveMessage = async (nickname, chatMessage) => connection()
  .then((db) => db.collection('olaa').insertOne({ nickname, chatMessage }))
  .then(({ insertedId }) => ({ _id: insertedId, nickname, chatMessage }));

const allMessage = async () => {
  connection().then((db) => db.collection('message').find({}).toArray());
};

module.exports = { saveMessage, allMessage };
