require('dotenv/config');
const { MongoClient } = require('mongodb');

// const { DB_URL, DB_NAME } = process.env;

const dbURL = process.env.DB_URL;
const dbName = process.env.DB_NAME;

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

module.exports = connect;
