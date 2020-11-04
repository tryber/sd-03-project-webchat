const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const moment = require('moment');
const connection = require('./tests/helpers/db');

let onlineUsers = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(`${__dirname}`));
app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/views/index.html`);
});

io.on('connection', async (socket) => {
  // const { id } = socket;
  socket.on('updateNickname', async (data) => {
    const { newNick } = data;
    const index = onlineUsers.findIndex((user) => user.id === socket.id);
    onlineUsers[index].nickname = newNick;
    io.emit('updateOnline', onlineUsers);
  });
  onlineUsers.push({ nickname: socket.id, id: socket.id });
  io.emit('updateOnline', onlineUsers);
  const getAll = await connection().then((db) =>
    db.collection('messages').find({}).toArray());
  getAll.forEach((message) => {
    const { nickname, date, chatMessage } = message;
    const completeMessage = `${date} ${nickname} ${chatMessage}`;
    socket.emit('history', completeMessage);
  });
  socket.on('disconnect', async () => {
    socket.disconnect();
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    io.emit('updateOnline', onlineUsers);
  });
  socket.on('message', (msg) => {
    // socket.broadcast.emit({ chatMessage: msg });
    const myDate = new Date();
    const formattedDate = moment(myDate).format('DD-MM-YYYY HH:mm:ss');
    const currentUser = onlineUsers.filter((user) => user.id === socket.id)[0];
    connection()
      .then((db) =>
        db.collection('messages').insertOne({
          id: socket.id,
          nickname: currentUser.nickname,
          chatMessage: msg.chatMessage,
          date: formattedDate,
        }))
      .catch((e) => console.log(e));
    const newMessage = msg;
    newMessage.date = formattedDate;
    const updatedNickname = onlineUsers.filter(
      (user) => user.id === socket.id,
    )[0].nickname;
    const { date, chatMessage } = newMessage;
    io.emit(
      'message',
      `${date} ${msg.nickname ? msg.nickname : updatedNickname} ${chatMessage}`,
    );
  });
});

http.listen(3000, () => {
  console.log('listening on 3000');
});
