const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { getAllMessage, saveMessage } = require('./models/messageModel');

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (_req, res) => {
  res.render('index.html');
});

io.on('connection', async (socket) => {
  const previousMessage = await getAllMessage();

  previousMessage.forEach(({ chatMessage, timestamp, nickname }) => {
    const message = `${nickname} ${timestamp} ${chatMessage}`;
    socket.emit('history', message);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const timesTamp = new Date();
    const time = moment(timesTamp).format('D-M-yyyy hh:mm:ss');
    const renderMessagens = `${nickname} ${time} ${chatMessage}`;

    socket.emit('message', renderMessagens);
    socket.broadcast.emit('message', renderMessagens);

    return saveMessage(chatMessage, nickname, time);
  });
});

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
