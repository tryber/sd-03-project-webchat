const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const moment = require('moment');
const connection = require('./tests/helpers/db');

let onlineUsers = [];

const createStructure = async () => {
  try {
    await connection.createCollection('messages');
    console.log('Banco criado');
  } catch (error) {
    console.log('Banco já existe');
  }
};
createStructure();

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(`${__dirname}`));
app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/views/index.html`);
});
// app.post('/chat', async (req, res) => {
//   const { nickname } = req.body;
//   console.log(nickname);
//   // if (nickname === undefined) return res.redirect('/');
//   userNickname = nickname;
//   onlineUsers.push(nickname);
//   console.log(onlineUsers);
//   const getAll = await connection().then((db) =>
//     db.collection('messages').find({}).toArray(),
//   );
//   const arrayMessages = getAll.map((message) => ({
//     chatMessage: message.chatMessage,
//     nickname: message.nickname,
//   }));
//   console.log(arrayMessages, 'array');
//   res.sendFile(`${__dirname}/public/views/index.html`);
// });

io.on('connection', async (socket) => {
  io.to(socket.id).emit('bem-vindo', 'Welcome to the chat!');
  onlineUsers.push(socket.id);
  console.log('onlineUsers', onlineUsers);
  const getAll = await connection().then((db) =>
    db.collection('messages').find({}).toArray());
  getAll.forEach((message) =>
    io.to(socket.id).emit('history', message));
  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.disconnect();
    onlineUsers = onlineUsers.filter((user) => user !== socket.id);
  });
  socket.on('message', (msg) => {
    // socket.broadcast.emit({ chatMessage: msg });
    const myDate = new Date();
    const formattedDate = moment(myDate).format('YYYY-MM-DD HH:mm:ss');
    connection()
      .then((db) =>
        db
          .collection('messages')
          .insertOne({
            chatMessage: msg.chatMessage,
            nickname: msg.nickname,
            date: formattedDate,
          }))
      .catch((e) => console.log(e));
    const newMessage = msg;
    newMessage.date = formattedDate;
    console.log(newMessage);
    io.emit('message', newMessage);
  });
});
io.on('connection', (_socket) => {
  console.log('A user connected');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
