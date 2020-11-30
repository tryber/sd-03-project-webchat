const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const moment = require('moment');
const serverIo = require('socket.io');
require('dotenv').config();

const controllers = require('./controllers');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/msg', controllers.messages.saveMessages);
app.get('/msg', controllers.messages.getMessages);

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const io = serverIo(server);

const onlineUsers = [];

io.on('connect', (socket) => {
  axios({
    method: 'GET',
    url: 'http://localhost:3000/msg',
  }).then(({ data }) => socket.emit('messages-history', data));

  socket.emit('online-users', onlineUsers);

  socket.on('user-nickname', ({ nickname: newUser }) => {
    onlineUsers.push({ name: newUser, id: socket.id });
    socket.emit('new-online-user', newUser);
    socket.broadcast.emit('new-online-user', newUser);
  });

  socket.on('disconnect', () => {
    const index = onlineUsers.map(({ id }) => id).indexOf(socket.id);
    if (index !== -1) onlineUsers.splice(index, 1);
    socket.broadcast.emit('new-online-list', onlineUsers);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const message = `${moment(new Date()).format(
      'DD-MM-yyyy hh:mm',
    )} - ${nickname} -> ${chatMessage}`;

    axios({
      method: 'POST',
      url: 'http://localhost:3000/msg',
      data: {
        message,
      },
    });

    socket.emit('message', message);
    socket.broadcast.emit('message', message);
  });
});
