const cors = require('cors');
const path = require('path');
const axios = require('axios');
const moment = require('moment');
const express = require('express');
const serverIo = require('socket.io');
const bodyParser = require('body-parser');

const { messageController } = require('./controllers');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/msg', messageController.saveMessages);
app.get('/msg', messageController.msgHistory);

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const io = serverIo(server);

const onlineUser = [];

io.on('connect', (socket) => {
  axios({
    method: 'GET',
    url: 'http://localhost:3000/msg',
  }).then(({ data }) => socket.emit('messages-history', data));

  socket.emit('online-users', onlineUser);

  socket.on('user-nickname', ({ nickname: newUser }) => {
    onlineUser.push({ name: newUser, id: socket.id });
    socket.emit('new-online-user', newUser);
    socket.broadcast.emit('new-online-user', newUser);
  });

  socket.on('disconnect', () => {
    const index = onlineUser.map(({ id }) => id).indexOf(socket.id);
    if (index !== -1) onlineUser.splice(index, 1);
    socket.broadcast.emit('new-online-list', onlineUser);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const message = `${moment(new Date()).format('DD-MM-yyyy hh:mm')} - ${nickname} -> ${chatMessage}`;

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
