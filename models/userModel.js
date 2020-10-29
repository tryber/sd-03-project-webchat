const connection = require('./connection');

const createUser = async (nickname, color) =>
  connection()
    .then((db) => db
      .collection('users')
      .insertOne({ nickname, color }))
    .then(({ insertedId }) => ({ userId: insertedId }))
    .catch((error) => {
      console.error(error);
      return { error: true, message: error.message, stack: error.stack };
      // process.exit(1);
    });

const deleteUserById = async (id) =>
  connection()
    .then((db) => db
      .collection('users')
      .deleteOne({ _id: id }))
    .catch((error) => {
      console.error(error);
      return { error: true, message: error.message, stack: error.stack };
      // process.exit(1);
    });

const getUserBy = async (id) =>
  connection()
    .then((db) => db
      .collection('users')
      .findOne({ _id: id }))
    .catch((error) => {
      console.error(error);
      return { error: true, message: error.message, stack: error.stack };
      // process.exit(1);
    });

const getAllUsers = async () =>
  connection()
    .then((db) => db
      .collection('users')
      .find({}).toArray())
    .catch((error) => {
      console.error(error);
      return { error: true, message: error.message, stack: error.stack };
      // process.exit(1);
    });

const updateNickname = async (id, nickname) => {
  connection()
    .then((db) => db
      .collection('users')
      .updateOne({ _id: id }, { $set: { nickname } }))
    .catch((error) => {
      console.error(error);
      return { error: true, message: error.message, stack: error.stack };
    // process.exit(1);
    });
};

module.exports = {
  createUser,
  deleteUserById,
  getUserBy,
  getAllUsers,
  updateNickname,
};
