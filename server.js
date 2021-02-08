const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers/index');

let aryUsersOnline = [];

// Fonte Math.random:
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const nickNameFunction = () => () => `Guest ${Math.floor(((Math.random() * 1000) + 1))}`;

const usersOnlines = (socketId, io) => (nickName) => {
  if (aryUsersOnline.some((user) => user.id === socketId)) {
    const newOnlines = aryUsersOnline.map((user) => {
      if (user.id === socketId) return { id: socketId, nickname: nickName };
      return user;
    }, []);
    aryUsersOnline = newOnlines;
  } else {
    aryUsersOnline.push({ id: socketId, nickname: nickName });
  }
  return io.emit('onlines', aryUsersOnline);
};

const getAllMessages = (socket) => async () => {
  const allMessages = await controllers.messageController.getAllMessages();
  socket.emit('history', allMessages);
};

const getPrivateMessages = (socket) => async (id) => {
  const privateMessages = await controllers.messageController.getPrivateMessages(id, socket.id);
  socket.join('room1');
  socket.emit('private-history', privateMessages);
};

// Fonte formato de data: https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
const privateMessage = (io, socket) => async (data) => {
  const currentDate = new Date();
  const formattedDate = `
    ${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}
    ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}
  `;

  const { nickname } = aryUsersOnline.find((user) => user.id === data.to);

  const message = `[Privado para ${nickname}] ${data.nickname}: ${data.chatMessage} ${formattedDate}`;

  await controllers.messageController.saveMsgPrivate(
    socket.id, data.to, { nickname, chatMessage: message },
  );

  io.in('room1').emit('private', { from: data.nickname, to: nickname, message });
};

const usersDisconnection = (socketId, io) => () => {
  const newOnline = aryUsersOnline.filter((user) => user.id !== socketId);
  aryUsersOnline = newOnline;
  return io.emit('onlines', aryUsersOnline);
};

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const PUBLIC_PATH = path.join(__dirname, 'public');
app.use(bodyParser.json());
app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

io.on('connection', async (socket) => {
  socket.emit('history', await controllers.messageController.getAllMessages());
  socket.emit('nickname', nickNameFunction());
  socket.on('history', getAllMessages(socket));
  socket.on('message', controllers.messageController.emitNewMessage(io));
  socket.on('nickname', usersOnlines(socket.id, io));
  socket.on('disconnect', usersDisconnection(socket.id, io));
  socket.on('private', privateMessage(io, socket));
  socket.on('private-history', getPrivateMessages(socket));
});

httpServer.listen(3000, () => {
  console.log(`Ouvindo na porta 3000`);
});
