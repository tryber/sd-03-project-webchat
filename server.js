const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const express = require('express');
const serverIo = require('socket.io');
const moment = require('moment');
const morgan = require('morgan');
const MessageRoutes = require('./routes/messageRoutes');

const app = express();
const { DB_URL, DB_NAME } = process.env;
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/msg', MessageRoutes);

// MONGOOSE
mongoose
  .connect(`${DB_URL}${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Mongo is running on cluster ${DB_URL}`));
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const io = serverIo(server);

const onlineUser = [];

io.on('connect', (socket) => {
  socket.join('public');
  axios({
    method: 'GET',
    url: 'http://localhost:3000/msg',
    data: {
      room: 'public',
    },
  }).then(({ data }) => socket.emit('messages-history', data));

  socket.emit('online-users', onlineUser);

  socket.on('user-nickname', (data) => {
    onlineUser.push(data);
    socket.emit('new-online-user', data.nickname);
    socket.broadcast.emit('new-online-user', data.nickname);
  });

  socket.on('disconnect', () => {
    const index = onlineUser.map(({ id }) => id).indexOf(socket.id);
    if (index !== -1) onlineUser.splice(index, 1);
    socket.broadcast.emit('new-online-list', onlineUser);
  });

  socket.on('message', (data) => {
    const newMsg = {
      message: data.chatMessage,
      nick: data.nickname,
      room: data.currentRoom,
      date: `${moment(new Date()).format('DD-MM-yyyy hh:mm:ss')}`,
    };

    axios({
      method: 'POST',
      url: 'http://localhost:3000/msg',
      data: { newMsg },
    });
    const msg = `${newMsg.date} => ${newMsg.nick}: ${newMsg.message}`;
    socket.emit('message', msg);
    socket.broadcast.emit('message', msg);
  });
});
