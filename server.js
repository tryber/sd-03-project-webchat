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
let clientsOnline = [];

app.get('/', (req, res) => {
  res.sendFile(`${PATH_STATIC}/client.html`);
});
io.on('connection', async (socket) => {
  console.log('connected');

  const messagesRegisters = await getAllMessages();
  socket.emit('history', messagesRegisters);
  sockets.newNickname = '';

  socket.on('error', (err) => console.log('Erro no socket', err));
  socket.on('changeNicknanme', (newNicknameParam) => {
    sockets.newNickname = newNicknameParam;
    const {newNickname} = sockets;
    clientsOnline.push({ nickname: newNickname, id: socket.id });
    io.emit('ClientsOnline', clientsOnline);
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
  socket.on('disconnect', () => {
    clientsOnline = clientsOnline.filter((client) => client.id !== socket.id);
    io.emit('ClientsOnline', clientsOnline);
    console.log('disconnect');
  });
  socket.on('connectedUser', (randonNickName) => {
    sockets.nickname = randonNickName;
    const { nickname } = sockets;
    clientsOnline.push({ nickname, id: socket.id });
    io.emit('ClientsOnline', clientsOnline);
    console.log('connected', randonNickName);
  });
});

http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));
