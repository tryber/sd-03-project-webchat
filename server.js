const express = require('express');
const http = require('./http');
const socket = require('./socket');
const dbConnection = require('./tests/helpers/db');

const app = express();

http(app, express);
const { httpServer } = socket(app, dbConnection);

httpServer.listen(3000, () => {
  console.log('App ouvindo na porta 3000');
});
