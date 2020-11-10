const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const moment = require('moment');
require('dotenv/config');

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  socket.on('message', (msg) => {
    const date = new Date();
    const newDate = moment(date).format('DD-MM-yyyy HH:mm:ss');
    const { chatMsg, nick } = msg;
    const formatMsg = `${nick} ${chatMsg}`;
    io.emit('message', formatMsg);
  });
});

app.use('/', express.static('./views', { extensions: ['html'] }));

const PORT = 3000;

server.listen(PORT, () => console.log(`Escutando na porta ${PORT}`));
