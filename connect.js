require('dotenv/config');
const { MongoClient } = require('mongodb');

const { DB_URL, DB_DBNAME } = process.env;
// Só irá funcionar para testes locais

const connect = async () => MongoClient.connect(
  DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // As novas regras que o team do MongoDB criou,
    // mas ficam desativadas por default para fins de retrocompatibilidade
  },
).then((connection) => connection.db(DB_DBNAME));

module.exports = connect;
