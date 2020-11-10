const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
// const bodyParser = require('body-parser');

function start({ PORT = 3000, PUBLIC_PATH = 'Public/chat.html' }, socketFunction) {
  const app = express();
  // app.use(bodyParser.json());
  const server = http.createServer(app);
  const io = socketIO(server);

  io.on('connection', socketFunction(io));
  app.use('/', (_req, res) => res.sendFile(path.join(__dirname, PUBLIC_PATH)));

  return [server, server.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}`))];
}

module.exports = start;
