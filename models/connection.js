const { MongoClient } = require('mongodb');
require('dotenv/config');

/* const {
  DB_URL = 'mongodb://localhost:27017',
  DB_NAME = 'webchat',
} = process.env; */

let schema;

module.exports = () => {
  if (schema) return Promise.resolve(schema);
  return MongoClient.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((connection) => connection.db(process.env.DB_NAME))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
