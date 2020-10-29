const path = require('path');
// const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const socketIO = require('socket.io');
const io = socketIO(http);

const notificationController = require('./controllers/notificationController');
const notifications = require('./services/messageService');

const PUBLIC_PATH = path.join(__dirname, 'public');

// app.use(bodyParser.json());
// app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));
app.get('/', (req, res) => {
  res.sendFile(PUBLIC_PATH + '/index.html');
});

const usersList = [];
let guestId = 0;

// socket.emit('nameChange', { newNickname: socket.guest });

io.on('connection', async (socket) => {
  guestId++;
  socket.guest = `Anônimo-${guestId}`;
  usersList.push(socket.guest);
  console.log(usersList);
  usersList.map((user) => socket.emit('nameChange', { newNickname: user }));

  // socket.broadcast.emit('message', { chatMessage: 'Usuário Anônimo Conectado', nickname: 'Bate-Papo' });
  const allNotifications = await notifications.getAllMessagesService();
  socket.emit('history', allNotifications);
  socket.on('message', notificationController.handleNotificationEvent(io, notifications));
  socket.on('nameChange', notificationController.handleNameChangeEvent(socket));
});

io.on('disconnecting', async (socket) => {
  socket.emit('userDisconnect', socket);
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
