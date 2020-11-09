require('dotenv/config');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
// const httpFactory = require('./http');
const http = require('http');
const socketFactory = require('./socket');
const { messageModel: model } = require('./models/index');
const connection = require('./models/connection');
// const notificationController = require('./controllers/notificationController');

const PORT = 3000;
async function start() {
  const app = express();

  app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  const httpServer = http.createServer(app);
  const io = socketIo(httpServer);

  const db = await connection();
  const messageModel = model(db);
  socketFactory(io, messageModel);

  httpServer.listen(PORT, () => console.log('HTTP listening on 3000'));
}

start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
