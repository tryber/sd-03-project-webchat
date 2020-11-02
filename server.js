const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
// const { connect } = require('./models/dbConnection');

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
  // const db = await connect();
  /*   guestId += 1;
*/
  // socket.nickname = guestId;
  socket.on('error', (err) => console.log('Erro no socket', err));
  socket.on('changeNicknanme', (newNickname) => {
    sockets.newNickname = newNickname;
    console.log(`new Nickname ${sockets.nickname}`);
  });
  socket.on('message', (msg) => {
    const dateObj = new Date();
    const date = `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`;
    const time = `${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
    const { chatMessage, nickname } = msg;
    if (sockets.newNickname !== nickname && sockets.newNickname !== undefined) {
      sockets.nickname = sockets.newNickname;

      sockets.chatMessage = chatMessage;
      socket.broadcast.emit('message', `${sockets.nickname} ${sockets.chatMessage} ${date} ${time}`);
      return socket.emit('message', `${sockets.nickname} ${sockets.chatMessage} ${date} ${time}`);
    }

    sockets.nickname = nickname;
    sockets.chatMessage = chatMessage;
    socket.broadcast.emit('message', `${sockets.nickname} ${sockets.chatMessage} ${date} ${time}`);

    return socket.emit('message', `${sockets.nickname} ${sockets.chatMessage} ${date} ${time}`);
  });
});

http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));
