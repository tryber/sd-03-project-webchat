const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const moment = require('moment');
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

io.on('connection', async (socket) => {
  console.log(`client ${socket.id} connected`);

  const chatHistory = await chatModel.readChat();
  const date = new Date();
  const now = moment(date).format('DD-MM-yyyy HH:mm:ss');

  chatHistory.forEach(({ nickname, chatMessage, date }) => {
    socket.emit('history', `${nickname} ${chatMessage} ${date}`);
  });

  socket.on('nickname', (newNickname) => {
    let { nickname } = aboutUser;
    nickname = newNickname;
    console.log(`Client ${socket.id} change nickname for ${nickname}`);
  });

  socket.on('message', async (data) => {
    const { nickname, chatMessage } = data;
    aboutUser.nickname = nickname;
    aboutUser.chatMessage = chatMessage;

    await chatModel.createChat(
      nickname,
      chatMessage,
      now,
    );

    io.emit('message', `${nickname} ${chatMessage} ${now}`);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
