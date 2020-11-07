const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const { PORT = 3000 } = process.env;

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('client connected');

  socket.emit('message', 'Hello!');
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
