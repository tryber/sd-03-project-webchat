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
const guestId = 0;
const broadcastMessage = (from, message) => {
  sockets
    .filter((socket) => socket.guest !== from)
    .forEach((socket) => socket.write(message));
};

app.get('/', (req, res) => {
  console.log(PATH_STATIC);
  res.sendFile(`${PATH_STATIC}/client.html`);
});
io.on('connection', (socket) => {
  /*  guestId += 1; */
  /*  socket.guest = `Guest ${guestId}`;
  sockets.push(socket);
  socket.write('boas vindas ao chat !');
  broadcastMessage(socket.guest, `${socket.guest} entrou no chat`);
  socket.on('end', () => {
    sockets.splice(sockets.indexOf(socket), 1);
    const message = `${socket.guest} deixou o chat`;
    broadcastMessage(socket.guest, message);
  });
  socket.on('data', (data) => {
    const message = `${socket.guest} > ${data.toString('utf-8')}`;
    broadcastMessage(socket.guest, message);
  }); */
  socket.on('error', (err) => console.log('Erro no socket', err));
});

/* server.on('error', (err) => console.log('Erro no server', err));
 */
http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));
