require('dotenv').config();
const mongodb = require('mongodb').MongoClient;

const DB_URL = process.env.DB_URL || 'mongodb://mongodb:27017/webchat';
const DB_NAME = process.env.DB_NAME || 'webchat';

module.exports = () =>
  mongodb.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((connection) => connection.db(DB_NAME))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
