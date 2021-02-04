const moment = require('moment');
const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const socketIO = require('socket.io');

const io = socketIO(http);
const { saveMessage, getAllMessage } = require('./models/messageModel');

const PUBLIC_PATH = path.join(__dirname, 'public');
app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

const PORT = 3000;
const userInObj = {};

io.on('connection', async (socket) => {
  // gero um nome aleatório e salvo ele em um obj { idDoSocket : nomeAleatório}
  const getRandomName = () => `User ${Math.ceil(Math.random() * 100)}`;

  userInObj[socket.id] = getRandomName();
  const newNickname = Object.values(userInObj);

  socket.emit('changeName', { newNickname });
  socket.broadcast.emit('changeName', { newNickname });

  // chat persistence
  const allMessages = await getAllMessage();
  const messageArray = [];
  allMessages.map((e) => {
    const { nickname, chatMessage, timestamp } = e;
    const time = moment(timestamp).format('D-M-yyyy hh:mm:ss');
    const messageToSend = `chatMessage: ${time} ${nickname} Say: ${chatMessage}`;
    return messageArray.push(messageToSend);
  });
  socket.emit('history', messageArray);
  socket.broadcast.emit('history', messageArray);
  // chat message
  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    const timestamp = new Date();
    await saveMessage(chatMessage, nickname, timestamp);
    const time = moment(timestamp).format('D-M-yyyy hh:mm:ss');
    const messageToSend = `chatMessage: ${time} ${nickname} Say: ${chatMessage}`;
    socket.emit('message', messageToSend);
    socket.broadcast.emit('message', messageToSend);
  });
  // change name
  socket.on('changeName', (data) => {
    const id = data.socketID;
    const userName = userInObj;
    userName[id] = data.newNickname;
    const newNick = Object.values(userName);
    socket.broadcast.emit('changeName', { newNickname: newNick });
    socket.emit('changeName', { newNickname: newNick });
  });

  socket.on('disconnect', () => {
    delete userInObj[socket.id];
    socket.emit('changeName', { newNickname: Object.values(userInObj) });
  });
});

http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));

// Alteração do todo o código com ajuda do Wilian por motivo de não conseguir passar no requisito 4.
