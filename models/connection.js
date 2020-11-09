const mongodb = require('mongodb').MongoClient;
require('dotenv').config();

let schema = null;

const connection = () => {
  if (schema) return Promise.resolve(schema);
  return mongodb
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(process.env.DB_NAME))
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
