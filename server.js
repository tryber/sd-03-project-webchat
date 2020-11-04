// const path = require('path');
// const express = require('express');

const moment = require('moment');

// const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
// const bodyParser = require('body-parser');

// const { saveMessage, getAllMessages } = require('./models/saveMessage');

// const PUBLIC_PATH = path.join(__dirname, 'public');

// app.use(bodyParser.json());
// app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

// const online = [];

// io.on('connection', async (socket) => {
//   socket.emit('online', online);
//   const previosMessage = await getAllMessages();
//   previosMessage.forEach((e) => {
//     const { nickname, chatMessage, timestamp } = e;
//     const time = moment(timestamp).format('D-M-yyyy hh:mm:ss');
//     const messageToSend = `chatMessage: ${time} ${nickname} say: ${chatMessage}`;
//     return socket.emit('history', messageToSend);
//   });

//   socket.on('message', ({ chatMessage, nickname }) => {
//     const time = moment(new Date()).format('D-M-yyyy hh:mm:ss');
//     const renderMessagens = `${nickname} Time: ${time} Say: ${chatMessage}`;
//     socket.emit('message', renderMessagens);
//     socket.broadcast.emit('message', renderMessagens);

//     socket.on('changeName', ({ newNickName }) => {
//       socket.emit('changeName', newNickName);
//     });
//     return saveMessage(socket.id, chatMessage, nickname, time);
//   });
// });

// http.listen(3000, () => console.log('Servidor ouvindo na porta 3000'));

const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const socketIO = require('socket.io');

const io = socketIO(http);
const { saveMessage, getAllMessages } = require('./models/saveMessage');

const PUBLIC_PATH = path.join(__dirname, 'public');
app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));

const userInObj = {};

io.on('connection', async (socket) => {
  // gero um nome aleatório e salvo ele em um obj { idDoSocket : nomeAleatório}
  const getRandomName = () => `User ${Math.ceil(Math.random() * 100)}`;

  userInObj[socket.id] = getRandomName();
  const newNickname = Object.values(userInObj);

  socket.emit('changeName', { newNickname });
  socket.broadcast.emit('changeName', { newNickname });

  // chat persistence
  const allMessages = await getAllMessages();
  const messageArray = [];
  allMessages.map((e) => {
    const { nickname, chatMessage, timestamp } = e;
    const time = moment(timestamp).format('D-M-yyyy hh:mm:ss');
    const messageToSend = `chatMessage: ${time} ${nickname} Say: ${chatMessage}`;
    return messageArray.push(messageToSend);
  });
  socket.emit('history', messageArray);
  socket.broadcast.emit('history', messageArray);
  // chat message
  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    const timestamp = new Date();
    await saveMessage(chatMessage, nickname, timestamp);
    const time = moment(timestamp).format('D-M-yyyy hh:mm:ss');
    const messageToSend = `chatMessage: ${time} ${nickname} Say: ${chatMessage}`;
    socket.emit('message', messageToSend);
    socket.broadcast.emit('message', messageToSend);
  });
  // change name
  socket.on('changeName', (data) => {
    const id = data.socketID;
    const userName = userInObj;
    userName[id] = data.newNickname;
    const newNick = Object.values(userName);
    socket.broadcast.emit('changeName', { newNickname: newNick });
    socket.emit('changeName', { newNickname: newNick });
  });

  socket.on('disconnect', () => {
    delete userInObj[socket.id];
    socket.emit('changeName', { newNickname: Object.values(userInObj) });
  });
});

http.listen(3000, () => console.log('Servidor ouvindo na porta 3000'));
