const http = require('http');

const socketIo = require('socket.io');

const notificationController = require('./controllers/notificationController');

const users = [];

module.exports = (connection, app) => {
  const httpServer = http.createServer(app);
  const io = socketIo(httpServer);

  io.on('connection', async (socket) => {
    const db = await connection();

    const chatMessages = await db.collection('messages').find({}).toArray();
    socket.emit('history', chatMessages, users, socket.id);
    socket.on('online', notificationController.handleOnline(socket, users, io));
    socket.on('message', notificationController.handleNotificationEvent(db, socket, io));
    socket.on('newNickname', notificationController.handleNewName(db, socket, users));
    socket.on('disconnect', notificationController.handleDisconnect(socket, users, io));
  });

  return {
    ioServer: httpServer,
    io,
  };
};
