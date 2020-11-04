const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { getMessageController } = require('./controllers');
const getRandomicNickname = require('./utils/getRandomicNickname');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messageController = getMessageController(io);
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.post('/message', messageController.sendMessage);

app.use('/', express.static('./public', { extensions: ['html'] }));

io.on('connection', (socket) => {
  const nickname = getRandomicNickname();

  socket.emit('connect');
  socket.broadcast.emit('joined', { nickname });
});

server.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
