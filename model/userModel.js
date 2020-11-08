const connection = require('./connection');

const saveUser = async (user) =>
  connection().then((db) => db.collection('online').insertOne({ user }));

const getAllOnlineUser = async () =>
  connection().then((db) => db.collection('online').find({}).toArray());

const removeUser = async (user) =>
  connection().then((db) => db.collection('online').deleteOne({ user }));

const updateUser = async (user, newName) =>
  connection().then((db) =>
    db.collection('online').updateOne({ user }, { $set: { user: newName } }));

module.exports = {
  saveUser,
  getAllOnlineUser,
  removeUser,
  updateUser,
};
