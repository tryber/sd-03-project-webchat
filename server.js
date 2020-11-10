const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const { getAllMessage, saveMessage } = require('./models/messageModel');

const PORT = 3000;
let usersOnline = [];

app.use(express.static(path.join(__dirname, 'client')));

app.use('/', (_req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
});

io.on('connection', async (socket) => {
  const previousMessage = await getAllMessage();

  previousMessage.forEach(({ chatMessage, timestamp, nickname }) => {
    const messageToSend = `${nickname} ${timestamp} ${chatMessage}`;
    socket.emit('history', messageToSend);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    console.log(nickname);
    const time = new Date();
    const timeEdited = moment(time).format('D-M-yyyy hh:mm:ss');
    const renderMessages = `${nickname} ${timeEdited} ${chatMessage}`;

    io.emit('message', renderMessages);
    // socket.broadcast.emit('message', renderMessages);

    return saveMessage(chatMessage, nickname, timeEdited);
  });

  socket.on('user-login', ({ nickname }) => {
    usersOnline.push({ socketId: socket.id, nickname });
    console.log(usersOnline);
    io.emit('update-users', usersOnline);
  });

  socket.on('name-change', ({ newNickname }) => {
    usersOnline = usersOnline.filter(({ nickname }) => nickname !== newNickname);
    usersOnline.push({ socketId: socket.id, nickname: newNickname });
    io.emit('update-users', usersOnline);
  });

  socket.on('disconnect', () => {
    usersOnline = usersOnline.filter(({ socketId }) => socketId !== socket.id);
    io.emit('update-users', usersOnline);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
