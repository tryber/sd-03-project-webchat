const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const { getAllMessages, insertMessages } = require('./models/messageModels');

const PATH_STATIC = path.join(`${__dirname}/public`);
app.use(bodyParser.json());
app.use('/', express.static('/public', { extensions: ['html'] }));

const PORT = 3000;
const sockets = { nickname: '', chatMessage: '', clientSocketId: '', isClientOnline: '' };

app.get('/', (req, res) => {
  res.sendFile(`${PATH_STATIC}/client.html`);
});
io.on('connection', async (socket) => {
  socket.on('userOnline', (clientSocketId) => {
    console.log(clientSocketId);
    sockets.clientSocketId = clientSocketId;
    sockets.isClientOnline = true;
    console.log(sockets.clientSocketId);
  });
  const messagesRegisters = await getAllMessages();
  socket.emit('history', messagesRegisters);
  sockets.newNickname = '';

  socket.on('error', (err) => console.log('Erro no socket', err));
  socket.on('changeNicknanme', (newNickname) => {
    sockets.newNickname = newNickname;
    console.log(`new Nickname ${sockets.nickname}`);
  });
  socket.on('message', async (msg) => {
    const dateObj = new Date();
    const date = `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`;
    const time = `${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
    const { chatMessage, nickname } = msg;
    if (sockets.newNickname !== '') {
      sockets.nickname = sockets.newNickname;
    } else {
      sockets.nickname = nickname;
    }

    sockets.chatMessage = chatMessage;
    await insertMessages({
      chatMessage,
      nickname: sockets.nickname,
      datastamps: `${date} ${time}`,
      clientSocketId: sockets.clientSocketId,
      isClientOnline: sockets.isClientOnline,
    });
    socket.broadcast.emit('message', `${sockets.nickname} ${chatMessage} ${date} ${time}`);
    socket.emit('message', `${sockets.nickname} ${chatMessage} ${date} ${time}`);
  });
});

http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));
