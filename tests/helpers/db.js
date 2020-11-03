const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// para rodar localmente os testes
/* const user = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const authMechanism = 'DEFAULT';

const DB_URL = `mongodb://${user}:${password}@localhost:27017/?authMechanism=${authMechanism}`; */

let schema = null;

async function connection() {
  if (schema) return Promise.resolve(schema);

  return mongoClient
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
}

module.exports = connection;
