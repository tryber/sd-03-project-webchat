require('dotenv').config();

const { MongoClient } = require('mongodb');

const { DB_URL = 'mongodb://localhost:27017' } = process.env;
const { DB_NAME = 'webchat' } = process.env;

const connection = () =>
  MongoClient.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((connect) => connect.db(DB_NAME))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = connection;
