const http = require('http');

const socketIo = require('socket.io');

// const authController = require('./controllers/authController');
const notificationController = require('./controllers/notificationController');

const notifications = require('./services/messageService');

module.exports = () => {
  const httpServer = http.createServer();
  const io = socketIo(httpServer);

  io.on('connection', async (socket) => {
    const allNotifications = await notifications.getAllMessagesService();
    socket.emit('history', allNotifications);
    socket.on('notification', notificationController.handleNotificationEvent(io, notifications));
    socket.on('nameChange', notificationController.handleNameChangeEvent(socket));
  });

  return {
    ioServer: httpServer,
    io,
  };
};
