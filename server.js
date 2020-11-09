const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const chatModel = require('./back-end/model/chatModel');

const app = express();

app.use(bodyParser.json());
app.use('/', express.static('./front-end', { extensions: ['html'] }));

const PORT = 3000;
const server = http.createServer(app);
const io = socketIo(server);

const aboutUser = {
  chatMessage: [],
  nickname: '',
};

app.get('/test', async (_req, res) => {
  await chatModel.readChat();
  res.status(200).json();
});

io.on('connection', async (socket) => {
  console.log(`client ${socket.id} connected`);

  const chatHistory = await chatModel.readChat();

  chatHistory.forEach(({ nickname, chatMessage, date }) => {
    socket.emit('history', { nickname, chatMessage, date });
  });

  socket.on('nickname', (newNickname) => {
    let { nickname } = aboutUser;
    nickname = newNickname;
    console.log(`Client ${socket.id} change nickname for ${nickname}`);
    socket.broadcast.emit('nickname', nickname);
  });

  socket.on('message', async (data) => {
    const { nickname, chatMessage, date } = data;
    aboutUser.nickname = nickname;
    aboutUser.chatMessage = chatMessage;

    await chatModel.createChat(
      nickname,
      chatMessage,
      date,
    );
    socket.broadcast.emit('message', data);
    socket.emit('message', data);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
