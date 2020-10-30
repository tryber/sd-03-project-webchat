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

io.on('connection', async (socket) => {
  // lida com as mensagens req: 1
  socket.on('message', ({ chatMessage, nickname }) => {
    const timesTamp = new Date();
    // const timesTamp = new Date().toLocaleDateString() formata local
    const time = moment(timesTamp).format('D-M-yyyy hh:mm:ss');
    const renderMessagens = `${nickname} Time: ${time} Say: ${chatMessage}`;
    socket.emit('message', renderMessagens);
    socket.broadcast.emit('message', renderMessagens);
    return saveMessage(chatMessage, nickname, time);
  });

  // mudar nome do nick req: 2
  socket.on('changeName', ({ newNickName }) => {
    console.log(newNickName);
    socket.emit('changeName', { newNickName });
    socket.broadcast.emit('changeName', { newNickName });
  });
});

http.listen(3000, () => console.log('Servidor ouvindo na porta 3000'));
