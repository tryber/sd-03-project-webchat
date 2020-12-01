const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const dbConnection = require('./tests/helpers/db');
const messageController = require('./controllers/messageController');

const httpPath = (appUsed, express) => {
  appUsed.use(bodyParser.json());
  appUsed.use('/', express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
  return appUsed;
};

let onlineUsers = [];

const newUser = (id, io) => {
  const nickname = `Guest ${Math.floor(((Math.random() * 1000)))}`;
  onlineUsers.push({ nickname, id });
  io.emit('getOnlineUsers', onlineUsers);
};

const disconnectUser = (id, io) => {
  onlineUsers = onlineUsers.filter((user) => user.id !== id);
  io.emit('getOnlineUsers', onlineUsers);
};

const changeNickname = (id, nickname, io) => {
  onlineUsers.map((user) => {
    const newNickname = user;
    if (user.id === id) {
      newNickname.nickname = nickname;
    }
    return user;
  });
  io.emit('getOnlineUsers', onlineUsers);
};

const createPrivateConnection = async (room, io, socket) => {
  socket.join(room);
  io.to(room).emit('history', await messageController.getChatHistory(room));
};

const leavePrivateConnection = async (room, socket) => {
  socket.leave(room);
  socket.emit('history', await messageController.getChatHistory());
};

const socket = (appParam) => {
  const httpServer = http.createServer(appParam);
  const io = socketIo(httpServer);
  io.on('connection', async (socket) => {
    newUser(socket.id, io);
    socket.emit('history', await messageController.getChatHistory());
    socket.on('getHistory', (room) => leavePrivateConnection(room, socket));
    socket.on('disconnect', () => disconnectUser(socket.id, io));
    socket.on('message', messageController.newMessage(io));
    socket.on('changeChat', (room) => createPrivateConnection(room, io, socket));
    socket.on('changeNickname', (nickname) => changeNickname(socket.id, nickname, io));
  });
  return { io, httpServer };
};

const app = express();

httpPath(app, express);
const { httpServer } = socket(app, dbConnection);

httpServer.listen(3000, () => {
  console.log('App ouvindo na porta 3000');
});
