const socketIo = require('socket.io');
const http = require('http');
const messageController = require('./controllers/messageController');

let onlineUsers = [];

const newUser = (id, io) => {
  const nickname = `Guest ${Math.floor(((Math.random() * 1000)))}`;
  onlineUsers.push({ nickname, id });
  io.emit('getOnlineUsers', onlineUsers);
};

const disconnectUser = (id, io) => {
  onlineUsers = onlineUsers.filter((user) => user.id !== id);
  io.emit('getOnlineUsers', onlineUsers);
};

const changeNickname = (id, nickname, io) => {
  onlineUsers.map((user) => {
    const newNickname = user;
    if (user.id === id) {
      newNickname.nickname = nickname;
    }
    return user;
  });
  io.emit('getOnlineUsers', onlineUsers);
};

const createPrivateConnection = async (room, io, socket) => {
  socket.join(room);
  io.to(room).emit('history', await messageController.getChatHistory(room));
};

const leavePrivateConnection = async (room, socket) => {
  socket.leave(room);
  socket.emit('history', await messageController.getChatHistory());
};

module.exports = (app, dbConnection) => {
  const httpServer = http.createServer(app);
  const io = socketIo(httpServer);
  io.on('connection', async (socket) => {
    console.log('conectado');
    newUser(socket.id, io);
    socket.emit('history', await messageController.getChatHistory());
    socket.on('getHistory', (room) => leavePrivateConnection(room, socket));
    socket.on('disconnect', () => disconnectUser(socket.id, io));
    socket.on('message', messageController.newMessage(io));
    socket.on('changeChat', (room) => createPrivateConnection(room, io, socket));
    socket.on('changeNickname', (nickname) => changeNickname(socket.id, nickname, io));
  });
  console.log(dbConnection);
  return { io, httpServer };
};
