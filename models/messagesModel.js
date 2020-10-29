const { dbConnection } = require('./connection');

const insertData = async (obj, coll) =>
  dbConnection(coll)
    .then((collection) =>
      collection
        .insertOne(obj));

const allPastMessages = async () =>
  dbConnection('messages')
    .then((collection) =>
      collection
        .find()
        .toArray());

const onlineUsers = async () =>
  dbConnection('onlineUsers')
    .then((collection) => collection
      .find()
      .toArray());

const changeNickname = async (obj) =>
  dbConnection('onlineUsers')
    .then((collection) => collection
      .updateOne({ _id: obj.id }, { $set: { nickname: obj.nickname } }));

const deleteUser = async (_id) =>
  dbConnection('onlineUsers')
    .then((collection) => collection
      .deleteOne({ _id }));

module.exports = {
  insertData,
  allPastMessages,
  onlineUsers,
  changeNickname,
  deleteUser,
};
