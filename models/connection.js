const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

module.exports = () => mongoClient
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => connection.db(process.env.DB_NAME))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
