require('dotenv/config');
const path = require('path');
const express = require('express');
// const httpFactory = require('./http');
const socketFactory = require('./socket');
const { messageModel: model } = require('./models/index');
const connection = require('./models/connection');
// const notificationController = require('./controllers/notificationController');

async function start() {
  const app = express();

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  const db = await connection();
  const messageModel = model(db);
  const { ioServer/* , io */ } = socketFactory(app, messageModel);
  // const http = httpFactory(ioServer);

  ioServer.listen(process.env.PORT, () => console.log('HTTP listening on 3000'));
}

start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
