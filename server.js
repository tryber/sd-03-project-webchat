require('dotenv').config();

const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer);
const express = require('express');
const path = require('path');
const messagesModel = require('./models/messagesModel');

const app = express();

const { PORT = 3000, IOPORT = 4555 } = process.env;

io.on('connect', async (socket) => {
  socket.broadcast.emit('serverResponse', { message: `${socket.id} entrou no chat!` });

  await messagesModel.insertData({ nickname: socket.id, _id: socket.id }, 'onlineUsers');

  const history = await messagesModel.allPastMessages();
  const onlineUsers = await messagesModel.onlineUsers();

  socket.emit('history', history);
  io.emit('onlineUsers', onlineUsers);

  socket.on('changeNickname', async (nickname) => {
    await messagesModel.changeNickname({ nickname, id: socket.id });
    const newList = await messagesModel.onlineUsers();
    socket.broadcast.emit('serverResponse', { message: `${socket.id} mudou seu nickname para ${nickname}!` });
    io.emit('onlineUsers', newList);
  });

  socket.on('message', async ({ nickname, message }) => {
    const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
    const time = Date().split(' ')[4];
    const toChat = `${date}, ${time} - (${nickname}): ${message}`;

    await messagesModel.insertData({ nickname, message: toChat, date: Date() }, 'messages');

    io.emit('serverResponse', { nickname, message: toChat });
  });

  socket.on('disconnect', async () => {
    await messagesModel.deleteUser(socket.id);
  });
});

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));

socketServer.listen(IOPORT, () => console.log(`Socket na port ${IOPORT}`));
