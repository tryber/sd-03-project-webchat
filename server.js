const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');
const moment = require('moment');
const { saveMessage, allMessage } = require('./model');

const app = express();
app.use(bodyParser.json());

app.use('/', express.static('./public', { extensions: ['html'] }));

const PORT = 3000;
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', async (socket) => {
  const msgDoBanco = await allMessage();
  msgDoBanco.forEach(({ nickname, chatMessage, novaData }) => {
    socket.emit('historico', { nickname, chatMessage, novaData });
  });

  const conect = socket.id;
  socket.broadcast.emit('conectado', conect);

  console.log(`${socket.id} conectado`);
  socket.on('message', async (data) => {
    const date = new Date();
    const newDate = moment(date).format('DD-MM-yyyy HH:mm:ss');

    io.emit('msgRecebida', { ...data, newDate });
    const { nickname, chatMessage } = data;
    await saveMessage(nickname, chatMessage, newDate);
  });
});

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
