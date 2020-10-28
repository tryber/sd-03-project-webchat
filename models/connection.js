const mongoConnection = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

const connection = () =>
  mongoConnection
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((mongodb) => mongodb.db('webchat'))
    .catch((err) => err);

const dbConnection = (coll) =>
  connection()
    .then((db) => db.collection(coll));

module.exports = { dbConnection };
