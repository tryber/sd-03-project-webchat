const { MongoClient } = require('mongodb');
require('dotenv/config');

const connect = () =>
  MongoClient.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((connection) => connection.db(process.env.DB_NAME))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = connect;
