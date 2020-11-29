require('dotenv/config');

const { MongoClient } = require('mongodb');

const { DB_URL, DB_NAME } = process.env;

const dbUrl = DB_URL || 'mongodb://mongodb:27017/webchat';
const dbName = DB_NAME || 'webchat';

const connect = () => MongoClient.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => connection.db(dbName));

module.exports = connect;
