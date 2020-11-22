// o codigo deste projeto foi baseado no codigo da aula ao vivo presente neste pull request:
// https://github.com/tryber/sd-03-live-lectures/tree/socket-io
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const messages = require('./models/messagesModel');
const messengerController = require('./controllers/messengerController');

const PUBLIC_PATH = path.join(__dirname, 'public');

const app = express();

const httpServer = http.createServer(app);

app.use(bodyParser.json());

app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

const io = socketIo(httpServer);

io.on('connection', async (socket) => {
  const history = await messages.getAll();

  socket.emit('messageHistory', history);

  socket.on('message', (data) => {
    messengerController.sendMessage(socket, data);
    socket.broadcast.emit('messageReceived', data);
  });
});

httpServer.listen(3000, () => console.log('HTTP listening on 3000'));
