require('dotenv').config();

const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const messagesModel = require('./models/messagesModel');

const app = express();

let activeUsers = [];

const server = http.createServer(app);

const io = socketIo(server);

const { PORT = 3000 } = process.env;

io.on('connect', async (socket) => {
  activeUsers.push({ nickname: socket.id, _id: socket.id });

  const history = await messagesModel.allPastMessages();

  history.forEach((message) => socket.emit('message', message.chatMessage));

  io.emit('onlineUsers', activeUsers);

  socket.on('changeNickname', async (nickname) => {
    const socketIndex = activeUsers.findIndex(({ _id }) => _id === socket.id);
    activeUsers[socketIndex].nickname = nickname;
    io.emit('onlineUsers', activeUsers);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
    const time = Date().split(' ')[4];
    const toChat = `${date}, ${time} - (${nickname || socket.id}): ${chatMessage}`;

    await messagesModel.insertData({ nickname, chatMessage: toChat, date: Date() }, 'messages');

    io.emit('message', toChat);
  });

  socket.on('disconnect', async () => {
    activeUsers = activeUsers.filter(({ _id }) => socket.id !== _id);
    io.emit('onlineUsers', activeUsers);
  });
});

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => console.log(`Socket na port ${PORT}`));
