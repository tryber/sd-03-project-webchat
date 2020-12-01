require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { join } = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { saveMessage, formatMessage } = require('./model/messages');
const { hydrateMessages } = require('./services/messages');

let usersOnline = [];

app.use(cors());
app.use('/', express.static(join(__dirname, 'public')));

io.on('connection', (socket) => {
  hydrateMessages(socket);

  socket.on('userOn', (user) => {
    usersOnline.push({ user, socket: socket.id });
    // const userNameList = usersOnline.map(({ user: userField }) => userField);
    console.log('usuários online');
    usersOnline.forEach((user) => console.log(user));
    io.emit('userList', usersOnline);
  });

  socket.on('change-nick', (user) => {
    const socketIndex = usersOnline.findIndex(
      ({ socket: scoketToReplace }) => scoketToReplace === socket.id,
    );

    usersOnline[socketIndex].user = user;

    // const userNameList = usersOnline.map(({ user: userField }) => userField);

    io.emit('userList', usersOnline);
  });

  socket.on('disconnect', () => {
    usersOnline = usersOnline.filter(
      ({ socket: socketToStay }) => socketToStay !== socket.id,
    );
    // const userNameList = usersOnline.map(({ user: userOnline, socket: userField }) => userField);
    io.emit('userList', usersOnline);
    console.log('user has disconnected');
    console.log(`remaingUsers:${usersOnline.length}`);
  });

  socket.on('message', (message) => {
    console.log('message', message);
    saveMessage(message).then(io.emit('message', formatMessage(message)));
  });

  socket.on('private', (user, message) => {
    console.log(user);
    const { socket: id, user: room } = usersOnline.find(
      (userOn) => userOn.socket === user,
    );
    saveMessage(message).then(
      io
        .to(id)
        .to(socket.id)
        .emit('message', formatMessage(message, true), [id, socket.id]),
    );
  });
});

const PORT_EXPRESS = process.env.PORT_EXPRESS || 3000;
http.listen(PORT_EXPRESS, () => console.log(`Listen to port ${PORT_EXPRESS}`));
