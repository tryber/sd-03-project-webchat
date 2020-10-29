const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers/index');

const app = express();
const PUBLIC_PATH = path.join(__dirname, 'publicHTML');

module.exports = (io) => {
  app.use(bodyParser.json());

  app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

  return app;
};
