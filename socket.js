const http = require('http');

const socketIo = require('socket.io');

const messengerController = require('./controllers/messengerController');

module.exports = () => {
  const httpServer = http.createServer();
  const io = socketIo(httpServer);

  io.on('connection', (socket) => {
    socket.on('message', (data) => messengerController.sendMessage(socket, data));
  });

  return {
    ioServer: httpServer,
    io,
  };
};
