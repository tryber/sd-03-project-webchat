const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers/index');

let onlines = [];

const handleUsersOnlines = (socketId, io) => (nickName) => {
  if (onlines.some((user) => user.id === socketId)) {
    const newOnlines = onlines.map((user) => {
      if (user.id === socketId) return { id: socketId, nickname: nickName };
      return user;
    }, []);
    onlines = newOnlines;
  } else {
    onlines.push({ id: socketId, nickname: nickName });
  }
  return io.emit('onlines', onlines);
};

const handleUsersDisconnection = (socketId, io) => () => {
  const newOnline = onlines.filter((user) => user.id !== socketId);
  onlines = newOnline;
  return io.emit('onlines', onlines);
};

const handleNickName = () => () => `Guest ${Math.floor(((Math.random() * 1000) + 1))}`;

const getAllMessages = (socket) => async () => {
  const allMessages = await controllers.messageController.getAllMessages();
  socket.emit('history', allMessages);
};

const app = express();

const httpServer = http.createServer(app);

const io = socketIo(httpServer);

const PUBLIC_PATH = path.join(__dirname, 'publicHTML');

app.use(bodyParser.json());

app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

io.on('connection', async (socket) => {
  socket.emit('history', await controllers.messageController.getAllMessages());
  socket.on('history', getAllMessages(socket));
  socket.emit('nickname', handleNickName());
  socket.on('message', controllers.messageController.newMessage(io));
  socket.on('nickname', handleUsersOnlines(socket.id, io));
  socket.on('disconnect', handleUsersDisconnection(socket.id, io));
});

httpServer.listen(3000, () => console.log('HTTP listening on port 3000'));
