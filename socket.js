const http = require('http');

const socketIo = require('socket.io');

const notificationController = require('./controllers/notificationController');

const ChatMessages = [];
const users = [];

module.exports = (connection) => {
  const httpServer = http.createServer();
  const io = socketIo(httpServer);

  io.on('connection', async (socket) => {
    await connection();
    socket.emit('history', ChatMessages, users, socket.id);
    socket.on('message', notificationController.handleNotificationEvent(ChatMessages, socket, users));
    socket.on('newNickname', notificationController.handleNewName(ChatMessages, socket, users));
  });

  return {
    ioServer: httpServer,
    io,
  };
};
