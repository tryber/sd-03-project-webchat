require('dotenv/config');
const { MongoClient } = require('mongodb');

const { DB_URI, DB_DBNAME } = process.env;
// Só irá funcionar para testes locais

const connect = async () => MongoClient.connect(
  DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // As novas regras que o team do MongoDB criou,
    // mas ficam desativadas por default para fins de retrocompatibilidade
  },
).then((connection) => connection.db(DB_DBNAME));

module.exports = connect;
