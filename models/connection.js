const { MongoClient } = require('mongodb');
require('dotenv/config');

const { DB_URL, DB_NAME } = process.env;

module.exports = () => MongoClient.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => connection.db(DB_NAME))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
