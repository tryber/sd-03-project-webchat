const connect = require('./dbConnection');

const getAllMessages = () =>
  connect().then((db) => db
    .collection('messages')
    .find().toArray());

const insertMessages = ({ chatMessage, nickname, datastamps }) => {
  connect().then((db) => db
    .collection('messages').insertOne({ chatMessage, nickname, datastamps }));
};

module.exports = {
  getAllMessages,
  insertMessages,
};
