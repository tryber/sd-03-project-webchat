const { MongoClient } = require('mongodb');
require('dotenv').config();

const { DB_NAME = 'webchat', DB_URL = 'mongodb://localhost:27017/webchat' } = process.env;

const connection = () =>
  MongoClient
    .connect(`${DB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((connect) => connect.db(DB_NAME));

module.exports = connection;
