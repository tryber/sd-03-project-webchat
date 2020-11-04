const { connect } = require('./dbConnection');

const getAllMessages = () =>
  connect().then((db) => db
    .collection('message')
    .find().toArray());

const insertMessages = (chatMessage, nickname, datastamps) => {
  console.log(chatMessage, nickname, datastamps);
  connect().then((db) => db
    .collection('message').insertOne(chatMessage, nickname, datastamps));
};
module.exports = {
  getAllMessages,
  insertMessages,
};
