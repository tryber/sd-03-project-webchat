const connection = require('./connection');

const registerUser = async (nick, id) => connection()
  .then((db) => db.collection('users').insertOne({ nick, _id: id }))
  .then((resp) => { console.log(resp)});

// const getUserById = async (id) => connection()
//   .then((db) => db.collection('users').findOne({ _id: id }))
//   .then((user) => user);

module.exports = {
  registerUser,
  // getUserById,
};
