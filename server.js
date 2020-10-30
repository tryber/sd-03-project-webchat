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
/* const broadcastMessage = (from, message) => {
  sockets
    .filter((socket) => socket.guest !== from)
    .forEach((socket) => socket.write(message));
}; */

app.get('/', (req, res) => {
  res.sendFile(`${PATH_STATIC}/client.html`);
});
io.on('connection', (socket) => {
  guestId += 1;
  console.log(`${guestId} connected`);

  socket.on('error', (err) => console.log('Erro no socket', err));
  socket.emit('message', [{ chatMessage: 'teste de envio de mensagem', nickname: 'fulano' }]);
});

http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));
