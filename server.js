const path = require('path');
const express = require('express');

const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const { saveMessage, getAllMessages } = require('./models/saveMessage');

const PUBLIC_PATH = path.join(__dirname, 'public');

app.use(bodyParser.json());
app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

const online = [];

io.on('connection', async (socket) => {
  socket.emit('online', online);
  const previosMessage = await getAllMessages();
  previosMessage.forEach((e) => {
    const { nickname, chatMessage, timestamp } = e;
    const time = moment(timestamp).format('D-M-yyyy hh:mm:ss');
    const messageToSend = `chatMessage: ${time} ${nickname} say: ${chatMessage}`;
    return socket.emit('history', messageToSend);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const time = moment(new Date()).format('D-M-yyyy hh:mm:ss');
    const renderMessagens = `${nickname} Time: ${time} Say: ${chatMessage}`;
    socket.emit('message', renderMessagens);
    socket.broadcast.emit('message', renderMessagens);

    socket.on('changeName', ({ newNickName }) => {
      socket.emit('changeName', newNickName);
    });
    return saveMessage(socket.id, chatMessage, nickname, time);
  });
});

http.listen(3000, () => console.log('Servidor ouvindo na porta 3000'));
