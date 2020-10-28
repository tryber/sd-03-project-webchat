const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const { idValidate } = require('./middlewares/validate');

// const userController = require('./controllers/userController');

const app = express();

const PUBLIC_PATH = path.join(__dirname, 'public');

module.exports = () => {
  app.use(bodyParser.json());

  app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));
  // app.post('/message', messageController.sendMessage(io));
  // app.post('/', userController.registerUser(io));

  return app;
};
