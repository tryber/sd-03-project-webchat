require('dotenv/config');

const {
  PORT, // porta dos sockets e do express
  DB_NAME, // nome do banco de dados
  DB_URL, // string de conexão do mongo
  PUBLIC_PATH, // camminho de html ate sua pagina home
} = process.env;

module.exports = {
  PORT, // porta dos sockets e do express
  DB_NAME, // nome do banco de dados
  DB_URL, // string de conexão do mongo
  PUBLIC_PATH, // camminho de html ate sua pagina home
};
