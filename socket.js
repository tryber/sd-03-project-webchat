const socketIo = require('socket.io');
const http = require('http');
const messageController = require('./controllers/messageController');

module.exports = (app, dbConnection) => {
  const httpServer = http.createServer(app);
  const io = socketIo(httpServer);
  io.on('connection', async (socket) => {
    console.log('conectado');
    socket.emit('history', await messageController.getChatHistory());
    socket.on('message', messageController.newMessage(io));
  });
  return { io, httpServer };
};
