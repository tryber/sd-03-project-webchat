const { ObjectId } = require('mongodb');
const { connection } = require('./connection');

const updateNickname = async (id, nickname) => connection()
  .then((db) => db.collection('messages')
    .updateOne({ _id: ObjectId(id) }, { $set: { nickname } }))
  .then(() => ({ _id: id, nickname }));

module.exports = {
  updateNickname,
};
