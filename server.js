const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const moment = require('moment');
const { saveChat, callChat } = require('./models/chatMsgs');
require('dotenv/config');

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('getHistory', async () => {
    //* Ao ser chamado, é feito uma busca no banco por todas as msg e retornado um array
    const msgs = await callChat();

    io.emit('historyMsgs', msgs);
  });

  socket.on('confirmConnect', (nick) => {
    //* Informado que um usuário foi conectado.
    io.emit('confirmConnect', nick);
  });

  socket.on('message', async (msg) => {
    //* cria algumas variáveis para gravar no banco.
    const date = new Date();
    const newDate = moment(date).format('DD-MM-yyyy HH:mm:ss');
    const { chatMessage, nickname } = msg;
    await saveChat(nickname, chatMessage, newDate);

    const formatMsg = `${nickname} ${newDate} ${chatMessage}`;
    io.emit('message', formatMsg);
  });
});

app.use('/', express.static('./views', { extensions: ['html'] }));

const PORT = 3000;

server.listen(PORT, () => console.log(`Escutando na porta ${PORT}`));
