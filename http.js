const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// const notificationController = require('./controllers/notificationController');

const app = express();

const PUBLIC_PATH = path.join(__dirname, 'public');

module.exports = () => {
  app.use(bodyParser.json());
  app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

  return app;
};
