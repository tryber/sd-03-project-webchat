// o codigo deste projeto foi baseado no codigo da aula ao vivo presente neste pull request:
// https://github.com/tryber/sd-03-live-lectures/tree/socket-io
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const moment = require('moment');
const messages = require('./models/messagesModel');
const messengerController = require('./controllers/messengerController');

const PUBLIC_PATH = path.join(__dirname, 'public');

const app = express();

const httpServer = http.createServer(app);

app.use(bodyParser.json());

app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

const io = socketIo(httpServer);

let onlineUsers = [];

io.on('connection', async (socket) => {
  const history = await messages.getAll();
  socket.emit('messageHistory', history);
  onlineUsers.push({ username: socket.id, id: socket.id });
  io.emit('refreshOnline', onlineUsers);

  socket.on('usernameUpdate', async (data) => {
    const { newUsername } = data;
    const index = onlineUsers.findIndex((user) => user.id === socket.id);
    onlineUsers[index].username = newUsername;
    io.emit('refreshOnline', onlineUsers);
  });

  socket.on('message', (data) => {
    const myDate = new Date();
    const formattedDate = moment(myDate).format('DD-MM-YYYY HH:mm:ss');
    const nickname = onlineUsers.filter((user) => user.id === socket.id)[0].username;
    const messageObject = {
      id: socket.id,
      nickname: data.nickname ? data.nickname : nickname,
      chatMessage: data.chatMessage,
      date: formattedDate,
    };
    messengerController.sendMessage(messageObject);
    io.emit(
      'renderMessage',
      messageObject,
    );
  });

  socket.on('disconnect', async () => {
    socket.disconnect();
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    io.emit('refreshOnline', onlineUsers);
  });
});

httpServer.listen(3000, () => console.log('HTTP listening on 3000'));
