const socketIo = require('socket.io');
const http = require('http');
const messageController = require('./controllers/messageController');

const onlineUsers = new Set();

const getOnlineUsers = () => [...onlineUsers];

const newUser = (id, io) => {
  const nickname = `Guest ${Math.floor(((Math.random() * 1000)))}`;
  onlineUsers.add({ nickname, id });
  io.emit('getOnlineUsers', getOnlineUsers());
};

const disconnectUser = (id, io) => {
  onlineUsers.forEach((user) => { if (user.id === id) onlineUsers.delete(user); });
  io.emit('getOnlineUsers', getOnlineUsers());
};

module.exports = (app, dbConnection) => {
  const httpServer = http.createServer(app);
  const io = socketIo(httpServer);
  io.on('connection', async (socket) => {
    console.log('conectado');
    newUser(socket.id, io);
    socket.emit('history', await messageController.getChatHistory());
    socket.on('disconnect', () => disconnectUser(socket.id, io));
  });
  console.log(dbConnection);
  return { io, httpServer };
};
