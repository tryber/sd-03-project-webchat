require('dotenv').config();
const mongoConnection = require('mongodb').MongoClient;

const connection = () =>
  mongoConnection
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((mongodb) => mongodb.db(process.env.DB_NAME))
    .catch((err) => err);

const dbConnection = (coll) =>
  connection()
    .then((db) => db.collection(coll));

module.exports = { dbConnection };
