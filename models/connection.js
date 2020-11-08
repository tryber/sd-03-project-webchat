const { MongoClient } = require('mongodb');
require('dotenv/config');

const {
  DB_URL = 'mongodb://localhost:27017',
  DB_NAME = 'webchat',
} = process.env;

module.exports = () => MongoClient.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => connection.db(DB_NAME))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
