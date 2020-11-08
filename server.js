const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use('/', express.static('./front-end', { extensions: ['html'] }));

const { PORT = 3000 } = process.env;
const server = http.createServer(app);
const io = socketIo(server);

const aboutUser = {
  actualyMessage: [],
  userNick: '',
};
// const timeStamp = new Date();

io.on('connection', (socket) => {
  console.log(`client ${socket.id} connected`);

  socket.on('message', (data) => {
    console.log(data);
    aboutUser.actualyMessage.push(data);
    socket.broadcast.emit('actualyChat', data);
  });

  socket.on('nickname', (newNickname) => {
    aboutUser.userNick = newNickname;
    console.log(`Client ${socket.id} change nickname for ${aboutUser.userNick}`);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
