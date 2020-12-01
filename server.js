const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const moment = require('moment');
const { createMessage, getAllMessages } = require('./models/messagesModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

io.on('connection', async (socket) => {
  const messagesHistoric = await getAllMessages();

  messagesHistoric.forEach(({ chatMessage, nickname, timestamp }) => {
    const fullMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
    socket.emit('history', fullMessage);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');
    await createMessage(chatMessage, nickname, timestamp);
    const fullMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
    console.log(fullMessage);

    io.emit('message', fullMessage);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    io.emit('changeNickname', newNickname);
  });

  let usersList = [];

  socket.on('logged-users', ({ nickname }) => {
    usersList.push({ socketId: socket.id, nickname });
    io.emit('online-users', usersList);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    usersList.filter(({ nickname }) => nickname !== newNickname);
    usersList.push({ socketId: socket.id, nickname: newNickname });
    io.emit('online-users', usersList);
  });

  socket.on('disconnect', () => {
    usersList.filter(({ socketId }) => socketId !== socket.id);
    usersList = [];
    io.emit('online-users', usersList);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Lintening on ${PORT}`);
});
