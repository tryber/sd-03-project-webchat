require('dotenv/config');
const { MongoClient } = require('mongodb');

const { MONGO_DB_URL, DB_NAME } = process.env;

const dbURL = MONGO_DB_URL || 'mongodb://localhost:27017/Cookmaster';
const dbName = DB_NAME || 'Cookmaster';

const connect = () =>
  MongoClient.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((connection) => connection.db(dbName))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = {
  connect,
};
