const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const PATH_STATIC = path.join(`${__dirname}/public`);
app.use(bodyParser.json());
app.use('/', express.static('/public', { extensions: ['html'] }));

const PORT = 3000;
const sockets = [];
let guestId = 0;

app.get('/', (req, res) => {
  res.sendFile(`${PATH_STATIC}/client.html`);
});
io.on('connect', (socket) => {
  guestId += 1;
  socket.nickname = guestId;
  socket.on('error', (err) => console.log('Erro no socket', err));

  socket.on('message', (msg) => {
    const { chatMessage } = msg;
    socket.msg = chatMessage;
    sockets.push(socket);
    socket.broadcast.emit('message', chatMessage);
    console.log(`Guest ${guestId} disse >  ${socket.msg}`);
  });
});

http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));
