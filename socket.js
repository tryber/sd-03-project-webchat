const http = require('http');

const socketIo = require('socket.io');

const notificationController = require('./controllers/notificationController');

const ChatMessages = [];
const users = [];

module.exports = () => {
  const httpServer = http.createServer();
  const io = socketIo(httpServer);

  io.on('connection', (socket) => {
    socket.emit('history', ChatMessages);
    socket.on('message', notificationController.handleNotificationEvent(ChatMessages, socket, users));
    socket.on('newNickname', notificationController.handleNewName(ChatMessages, socket, users));
  });

  return {
    ioServer: httpServer,
    io,
  };
};
