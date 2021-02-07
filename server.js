const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers/index');

let aryUsersOnline = [];

const app = express();

const httpServer = http.createServer(app);

const io = socketIo(httpServer);

const PUBLIC_PATH = path.join(__dirname, 'public');
app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));
app.use(bodyParser.json());

httpServer.listen(3000, () => console.log('HTTP listening on port 3000'));

const usersOnlines = (socketId, io) => (nickName) => {
  console.log(aryUsersOnline);
  if (aryUsersOnline.some((user) => user.id === socketId)) {
    const newUsersOnline = aryUsersOnline.map((user) => {
      if (user.id === socketId) return { id: socketId, nickname: nickName };
      return user;
    }, []);
    aryUsersOnline = newUsersOnline;
  } else {
    aryUsersOnline.push({ id: socketId, nickname: nickName });
  }
  return io.emit('onlines', aryUsersOnline);
};

const usersDisconnection = (socketId, io) => () => {
  const newOnline = aryUsersOnline.filter((user) => user.id !== socketId);
  aryUsersOnline = newOnline;
  return io.emit('onlines', aryUsersOnline);
};

const emitNickName = `Guest ${Math.floor(((Math.random() * 1000) + 1))}`;

const privateMessage = (io, socket) => async (event) => {
  const newDate = new Date();
  const dateOk = `
    ${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}
    ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}
  `;

  const { nickname } = aryUsersOnline.find((user) => user.id === event.to);
  const message = `[Private message to ${nickname}] ${event.nickname}: ${event.chatMessage} ${dateOk}`;

  await controllers.messageController.savePrivateMessage(
    socket.id, event.to, { nickname, chatMessage: message },
  );
  io.in('room1').emit('private', { from: event.nickname, to: nickname, message });
};

const getAllMessages = (socket) => async () => {
  const allMessages = await controllers.messageController.getAllMessages();
  socket.emit('history', allMessages);
};

const getPrivateMessages = (socket) => async (id) => {
  const getMessages = await controllers.messageController.getPrivateMessages(id, socket.id);
  socket.join('room1');
  socket.emit('private-history', getMessages);
};

io.on('connection', async (socket) => {
  console.log('new connection');
  socket.on('nickname', usersOnlines(socket.id, io));
  socket.on('disconnect', usersDisconnection(socket.id, io));
  socket.emit('nickname', emitNickName);
  socket.on('private', privateMessage(io, socket));
  socket.emit('history', await controllers.messageController.getAllMessages());
  socket.on('history', getAllMessages(socket));
  socket.on('private-history', getPrivateMessages(socket));
  socket.on('message', controllers.messageController.newMessage(io));
});
