const http = require('http');

const socketIo = require('socket.io');

const emitHistory = async (messageModel, socket) => {
  const messages = await messageModel.getGeneral();

  const history = messages.map(({ chatMessage, nickname, date }) => `(${date}) ${nickname}: ${chatMessage}`);

  socket.emit('history', history);
};

module.exports = (app, messageModel) => {
  const httpServer = http.createServer(app);
  const io = socketIo(httpServer);

  io.on('connection', async (socket) => {
    await emitHistory(messageModel, socket);

    socket.on('disconnect', ({ nickname }) => {
      io.emit('mensagemServer', { chatMessage: `${nickname} saiu` });
    });

    socket.on('message', async ({ chatMessage, nickname }) => {
      const date = new Date().toLocaleString().split('-').join('/');

      await messageModel.insertGeneral({ chatMessage, nickname, date });
      io.emit('mensagemServer', `${nickname}, ${date}: ${chatMessage}`);
    });
  });

  return {
    ioServer: httpServer,
    io,
  };
};
