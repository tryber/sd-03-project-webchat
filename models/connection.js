const { MongoClient } = require('mongodb');
require('dotenv').config();

const { DB_URL, DB_NAME } = process.env;

const dbUrl = DB_URL || 'mongodb://mongodb:27017/webchat';
const dbName = DB_NAME || 'webchat';

const connect = async () => {
  try {
    const connection = await MongoClient.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return connection.db(dbName);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = connect;
