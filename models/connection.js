const { MongoClient } = require('mongodb');
require('dotenv').config();

const connection = () =>
  MongoClient
    .connect(`${process.env.DB_URL}/webchat`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((connect) => connect.db(process.env.DB_NAME));

module.exports = connection;
