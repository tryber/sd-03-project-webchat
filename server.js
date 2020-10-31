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

io.on('connection', async (socket) => {
  socket.on('updateNickname', (data) => {
    connection().then((db) =>
      db
        .collection('messages')
        .updateMany(
          { id: socket.id },
          { $set: { nickname: data.newNick } },
        ));
    onlineUsers.forEach((user) => {
      const usuario = user;
      if (user.id === socket.id) usuario.nickname = data.newNick;
      return usuario;
    });
    console.log('Online after nickChange', onlineUsers);
  });
  onlineUsers.push({ nickname: socket.id, id: socket.id });
  console.log('onlineUsers', onlineUsers);
  const getAll = await connection()
    .then((db) =>
      db
        .collection('messages')
        .find({})
        .toArray());
  getAll.forEach((message) => {
    const { nickname, date, chatMessage } = message;
    const completeMessage = `${nickname} ${date} ${chatMessage}`;
    io.to(socket.id).emit('history', completeMessage);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.disconnect();
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    console.log('Someone disconnected', onlineUsers);
  });
  socket.on('message', (msg) => {
    // socket.broadcast.emit({ chatMessage: msg });
    const myDate = new Date();
    const formattedDate = moment(myDate).format('DD-MM-YYYY HH:mm:ss');
    connection()
      .then((db) =>
        db.collection('messages').insertOne({
          id: socket.id,
          nickname: msg.nickname,
          chatMessage: msg.chatMessage,
          date: formattedDate,
        }))
      .catch((e) => console.log(e));
    const newMessage = msg;
    newMessage.date = formattedDate;
    const updatedNickname = onlineUsers.filter((user) => user.id === socket.id)[0].nickname;
    const { date, chatMessage } = newMessage;
    io.emit('message', `${updatedNickname} - ${date}: ${chatMessage}`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
