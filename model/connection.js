require('dotenv/config');
const { MongoClient } = require('mongodb');

// console.log('Variaveis de ambiente: ', process.env.MONGO_DB_URL, process.env.DB_NAME);

const connect = () =>
  MongoClient.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((connection) => connection.db(process.env.DB_NAME));

module.exports = {
  connect,
};  
