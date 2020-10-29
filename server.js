require('dotenv').config();

const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer);
const express = require('express');
const path = require('path');
const messagesModel = require('./models/messagesModel');

const app = express();

const { PORT, IOPORT } = process.env;

io.on('connect', async (socket) => {
  const history = await messagesModel.allPastMessages();
  socket.emit('history', history);

  socket.on('message', async ({ nickname, message }) => {
    const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
    const time = Date().split(' ')[4];
    const toChat = `${date}, ${time} - (${nickname}): ${message}`;

    await messagesModel.insertMessage({ nickname, message: toChat, date: Date() });

    io.emit('serverResponse', { nickname, message: toChat });
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });
});

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));

socketServer.listen(IOPORT, () => console.log(`Socket na port ${IOPORT}`));
