// const { ObjectId } = require('mongodb');
// const connection = require('./connection');

// const createUser = async (nickname, color, messages = []) =>
//   connection()
//     .then((db) => db
//       .collection('users')
//       .insertOne({ nickname, color, messages }))
//     .then(({ insertedId }) => ({ id: ObjectId(insertedId), nickname, color }))
//     .catch((error) => {
//       console.error(error);
//       return { error: true, message: error.message, stack: error.stack };
//       // process.exit(1);
//     });

// module.exports = {
//   createUser,

// };
