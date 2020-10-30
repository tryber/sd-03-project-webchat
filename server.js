const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { getAllMessages } = require('./services/messageService');
const { getAllUsers } = require('./services/userService');
const messageController = require('./controllers/messageController');
const userController = require('./controllers/userController');

app.use('/', express.static('./public', { extensions: ['html'] }));

io.on('connection', async (socket) => {
  socket.on('message', (data) => messageController.sendMessage(io, data));
  socket.emit('history', await getAllMessages());
  socket.emit('onlineUsers', await getAllUsers());
  socket.on('userConnected', (data) => {
    userController.registerUser(io, socket, data);
  });
  socket.on('userChangedNickName', (data) => userController.updateNickname(io, data));
});

const { PORT = 3000 } = process.env;

http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
