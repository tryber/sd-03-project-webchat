require('dotenv/config');
const { MongoClient } = require('mongodb');

const { DB_URL, DB_NAME2} = process.env;

/* const dbURL = MONGO_DB_URL || 'mongodb://localhost:27017/webchat';
const dbName = DB_NAME || 'webchat';
 */
const connect = () =>
  MongoClient.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((connection) => connection.db(DB_NAME2))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = {
  connect,
};
