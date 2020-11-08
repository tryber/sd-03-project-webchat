const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const chatModel = require('./back-end/model/chatModel');

const app = express();

app.use(bodyParser.json());
app.use('/', express.static('./front-end', { extensions: ['html'] }));

const { PORT = 3000 } = process.env;
const server = http.createServer(app);
const io = socketIo(server);

const aboutUser = {
  chatMessage: [],
  nickname: '',
};
const dateStamp = new Date();

io.on('connection', (socket) => {
  console.log(`client ${socket.id} connected`);

  socket.on('chatHistory', async () => {
    const chatHistory = await chatModel.readChat();
    socket.emit('chatHistory', chatHistory);
  });

  socket.on('nickname', (newNickname) => {
    aboutUser.nickname = newNickname;
    console.log(`Client ${socket.id} change nickname for ${aboutUser.nickname}`);
  });

  socket.on('message', async (data) => {
    const date = `${dateStamp.getDate()}/${dateStamp.getMonth() + 1}/${dateStamp.getFullYear()}`;
    const hour = `${dateStamp.getHours()}:${dateStamp.getMinutes()}`;
    const dateNow = `${date} ${hour}`;
    const { nickname, chatMessage } = data;
    aboutUser.nickname = nickname;
    aboutUser.chatMessage = chatMessage;

    await chatModel.createChat(
      nickname,
      chatMessage,
      dateNow,
    );
    socket.broadcast.emit('message', data);
    socket.emit('message', data);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
