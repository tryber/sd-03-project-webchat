const { connect } = require('./dbConnection');

const getAllMessages = () =>
  connect().then((db) => db
    .collection('message')
    .find().toArray());

module.exports = {
  getAllMessages,
};
