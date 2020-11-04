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
const sockets = { nickname: '', chatMessage: {} };
/* const guestId = 0;
 */
app.get('/', (req, res) => {
  res.sendFile(`${PATH_STATIC}/client.html`);
});
io.on('connect', async (socket) => {
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

    socket.broadcast.emit('message', `${sockets.nickname} ${chatMessage} ${date} ${time}`);
    socket.emit('message', `${sockets.nickname} ${chatMessage} ${date} ${time}`);
    await insertMessages({
      chatMessage,
      nickname: sockets.nickname,
      date: `${date} ${time}`,
    });
  });
});

http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));
