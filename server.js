require('dotenv').config();

const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const messagesModel = require('./models/messagesModel');

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

const { PORT = 3000 } = process.env;

io.on('connect', async (socket) => {
  await messagesModel.insertData({ nickname: socket.id, _id: socket.id }, 'onlineUsers');

  const history = await messagesModel.allPastMessages();
  const onlineUsers = await messagesModel.onlineUsers();

  history.forEach((message) => socket.emit('message', message.chatMessage));

  io.emit('onlineUsers', onlineUsers);

  socket.on('changeNickname', async (nickname) => {
    await messagesModel.changeNickname({ nickname, id: socket.id });
    const newList = await messagesModel.onlineUsers();
    io.emit('onlineUsers', newList);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
    const time = Date().split(' ')[4];
    const toChat = `${date}, ${time} - (${nickname || socket.id}): ${chatMessage}`;

    await messagesModel.insertData({ nickname, chatMessage: toChat, date: Date() }, 'messages');

    io.emit('message', toChat);
  });

  socket.on('disconnect', async () => {
    await messagesModel.deleteUser(socket.id);
    const newOnlineUsers = await messagesModel.onlineUsers();
    io.emit('onlineUsers', newOnlineUsers);
  });
});

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => console.log(`Socket na port ${PORT}`));
