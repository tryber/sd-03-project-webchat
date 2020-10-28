require('dotenv/config');

const {
  PORT, // porta dos sockets e do express
  DB_NAME, // nome do banco de dados
  DB_URL, // string de conexão do mongo
} = process.env;

module.exports = {
  PORT, // porta dos sockets e do express
  DB_NAME, // nome do banco de dados
  DB_URL, // string de conexão do mongo
};
