const path = require('path');
const express = require('express');

const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const { saveMessage } = require('./models/saveMessage');

const PUBLIC_PATH = path.join(__dirname, 'public');

app.use(bodyParser.json());
app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

// const getRandomName = () => `User ${Math.ceil(Math.random() * 100)}`;

io.on('connection', async (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    // const nickId = socket.id;

    const time = moment(new Date()).format('D-M-yyyy hh:mm:ss');
    const renderMessagens = `${nickname} Time: ${time} Say: ${chatMessage}`;
    socket.emit('message', renderMessagens);
    socket.broadcast.emit('message', renderMessagens);
    socket.on('changeName', ({ newNickName }) => {
      socket.emit('changeName', newNickName);
    });

    return saveMessage(chatMessage, nickname, time);
  });

  socket.emit('history');
});

http.listen(3000, () => console.log('Servidor ouvindo na porta 3000'));
