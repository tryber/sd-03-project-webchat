const connection = require('./connection');

const registerUser = async (nick, id) => connection()
  .then((db) => db.collection('users').insertOne({ nick, id }));

const removeUser = async (id, nick) => connection()
  .then((db) => db.collection('users').deleteOne({ $or: [{ _id: id }, { nick }] }));

const retrieveUsers = async () => connection()
  .then((db) => db.collection('users').find().toArray());

const updateUser = async (id, nick) => connection()
  .then((db) => db.collection('users').updateOne({ _id: id }, { $set: { nick } }));

module.exports = {
  registerUser,
  retrieveUsers,
  removeUser,
  updateUser,
};
