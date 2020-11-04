const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const dbURL = process.env.DB_URL || 'localhost:27017';
const dbName = process.env.DB_NAME || 'webchat';

let schema = null;
const connection = () => {
  if (schema) return Promise.resolve(schema);
  return mongoClient
    .connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(dbName))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
module.exports = connection;
