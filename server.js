const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { getAllMessages } = require('./services/messageServices');
const { getAllUsers } = require('./services/userServices');
const messageController = require('./controllers/messageController');
const userController = require('./controllers/userController');

app.use('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

io.on('connection', async (socket) => {
  socket.on('message', (data) => messageController.sendMessage(io, data));
  socket.emit('history', await getAllMessages());
  socket.emit('onlineUsers', await getAllUsers());
  socket.on('userConnected', (data) => {
    userController.registerUser(io, socket, data);
  });
  socket.on('userChangedNickName', (data) => userController.updateNickname(io, data));
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});
