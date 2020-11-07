const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { getMessageController, getUserController } = require('./controllers');
const getRandomicNickname = require('./utils/getRandomicNickname');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use('/', express.static('./public', { extensions: ['html'] }));

io.on('connection', (socket) => {
  const messageController = getMessageController(io);
  const userController = getUserController(socket);
  const nickname = getRandomicNickname();

  socket.emit('self-join', { nickname });
  socket.broadcast.emit('joined', { nickname });
  socket.on('message', messageController.sendMessage);
  socket.on('change-name', userController.updateName);
});

server.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
