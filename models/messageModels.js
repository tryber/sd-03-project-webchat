const connection = require('./dbConnection');

const getAllMessages = () =>
  connection().then((db) => db
    .collection('messages')
    .find().toArray());

const insertMessages = ({ chatMessage, nickname, datastamps, clientSocketId, isClientOnline }) => {
  connection().then((db) => db
    .collection('messages').insertOne({ chatMessage, nickname, datastamps, clientSocketId, isClientOnline }));
};

module.exports = {
  getAllMessages,
  insertMessages,
};
