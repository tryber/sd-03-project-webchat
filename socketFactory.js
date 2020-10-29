const http = require('http');
const socketIo = require('socket.io');
const controllers = require('./controllers/index');

let onlines = [];

const handleUsersOnlines = (socketId, io) => (nickName) => {
  if (onlines.some((user) => user.id === socketId)) {
    const newOnlines = onlines.map((user) => {
      if (user.id === socketId) return { id: socketId, nickname: nickName };
      return user;
    }, []);
    onlines = newOnlines;
  } else {
    onlines.push({ id: socketId, nickname: nickName });
  }
  return io.emit('onlines', onlines);
};

const handleUsersDisconnection = (socketId, io) => () => {
  const newOnline = onlines.filter((user) => user.id !== socketId);
  onlines = newOnline;
  return io.emit('onlines', onlines);
};

module.exports = () => {
  const httpServer = http.createServer();
  const io = socketIo(httpServer);

  io.on('connection', async (socket) => {
    // vem os on, emit, podendo passar o socket até para os controllers utilizarem.
    socket.emit('history', await controllers.messageController.getAllMessages());
    socket.on('message', controllers.messageController.newMessage(io));
    socket.on('nickname', handleUsersOnlines(socket.id, io));
    socket.on('disconnect', handleUsersDisconnection(socket.id, io));
  });

  return {
    ioServer: httpServer,
    io,
  };
};
