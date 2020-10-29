const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const socketIO = require('socket.io');

const io = socketIO(http);

const notificationController = require('./controllers/notificationController');
const notifications = require('./services/messageService');

const PUBLIC_PATH = path.join(__dirname, 'public');

app.get('/', (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/index.html`);
});

const usersList = {};
let guestId = 0;
let usersPool = '';

io.on('connection', async (socket) => {
  guestId += 1;
  usersPool = `Anônimo-${guestId}`;

  usersList[socket.id] = usersPool;

  const usersName = Object.values(usersList);

  socket.emit('nameChange', { newNickname: usersName });
  socket.broadcast.emit('nameChange', { newNickname: usersName });

  const allNotifications = await notifications.getAllMessagesService();
  socket.emit('history', allNotifications);

  socket.on('message', notificationController.handleNotificationEvent(io, notifications));

  socket.on('nameChange', notificationController.handleNameChangeEvent(socket, usersList));

  socket.on('disconnect', () => {
    delete usersList[socket.id];
    io.emit('nameChange', { newNickname: Object.values(usersList) });
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
