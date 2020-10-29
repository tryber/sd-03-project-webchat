const http = require('http');
const socketIo = require('socket.io');

const messages = require('./models/messagesModel');

const messengerController = require('./controllers/messengerController');

module.exports = () => {
  const httpServer = http.createServer();
  const io = socketIo(httpServer);

  io.on('connection', async (socket) => {
    const history = await messages.getAll();

    socket.emit('messageHistory', history);

    socket.on('message', (data) => {
      messengerController.sendMessage(socket, data);
      socket.broadcast.emit('messageReceived', data);
    });
  });

  return {
    ioServer: httpServer,
    io,
  };
};
