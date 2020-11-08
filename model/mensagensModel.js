const connection = require('./connect');

const saveMessage = async (nickname, chatMessage, dataActualy) => connection()
  .then((db) => db.collection('mensagens').insertOne({ nickname, chatMessage, dataActualy }))
  .then(({ insertedId }) => ({ _id: insertedId, nickname, chatMessage, dataActualy }));

const allMessage = async () => {
  connection().then((db) => db.collection('message').find({}).toArray());
};

module.exports = { saveMessage, allMessage };
