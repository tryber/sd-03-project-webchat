// index.js app do express
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('client connect');

  socket.emit('message', 'hello');
});

server.listen(3000, () => console.log('ouvindo na 3000'));