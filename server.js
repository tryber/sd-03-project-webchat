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
  socket.on('message', async (message) => {
    const date = new Date();
    const newDate = moment(date).format('DD-MM-yyyy HH:mm:ss');

    const { nickname, chatMessage } = message;
    io.emit('online', nickname);
    io.emit('message', `${newDate} ${nickname} ${chatMessage}`);
    await saveMessage(newDate, nickname, chatMessage);
  });

  const msgDoBanco = await allMessage();
  msgDoBanco.forEach(({ nickname, chatMessage, novaData }) => {
    socket.emit('historico', ` ${novaData} ${nickname} ${chatMessage}`);
  });
});

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
