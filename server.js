require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const socketIOServer = http.createServer();
const io = socketIo(socketIOServer);

const app = express();
const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 4555;

io.on('connect', async (socket) => {
  socket.on('message', async ({ message }) => {
    io.emit('messageToChat', { message });
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'client')));

app.listen(PORT, () => {
  console.log(`App ouvindo na porta ${PORT}`);
});

socketIOServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.io escutando na porta ${SOCKET_PORT}`);
});
