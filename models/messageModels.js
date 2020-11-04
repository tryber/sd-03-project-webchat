const connection = require('./dbConnection');

const getAllMessages = () =>
  connection().then((db) => db
    .collection('messages')
    .find().toArray());

const insertMessages = ({ chatMessage, nickname, datastamps }) => {
  connection().then((db) => db
    .collection('messages').insertOne({ chatMessage, nickname, datastamps }));
};

module.exports = {
  getAllMessages,
  insertMessages,
};
