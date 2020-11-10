const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { getMessageController, getUserController } = require('./controllers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(bodyParser.json());

app.use('/', express.static('./public', { extensions: ['html'] }));

io.on('connection', (socket) => {
  const messageController = getMessageController(io, socket);
  const userController = getUserController(io, socket);

  socket.on('history', messageController.getHistory);
  socket.on('message', messageController.sendMessage);
  socket.on('change-name', userController.updateName);
  socket.on('self-join', userController.saveUser);
  socket.on('disconnect', userController.removeUser);
});

server.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
