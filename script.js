const moment = require('moment');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const {
  registerMessage,
  retrieveMessages,
} = require('./model/messages');

let onlineUsers = [];

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

// TODO: implement the join in room function
io.on('connection', async (socket) => {
  // place the user on the public room
  socket.join('public');

  // checks to retrieve the correct messages

  socket.emit('allOnline', onlineUsers);
  // pega o histórico de mensagens
  const messages = await retrieveMessages('public');
  socket.emit('history', messages);

  socket.on('changeRoom', async (room) => {
    socket.leaveAll();
    socket.join(room);
    const messages = await retrieveMessages(room);
    io.to(room).emit('privMessages', messages);
  });

  socket.on('message', async (data) => {
    const { chatMessage, nickname, room } = data;
    const time = moment().format('DD-MM-YYYY hh:mm:ss');
    const user = onlineUsers.find((user) => user.nickname === nickname);
    const message = `${nickname} - ${time} - ${chatMessage}`;
    console.log(onlineUsers, user);
    // BUG: this user object sometimes is undefined so this line breaks
    await registerMessage(message, nickname, room);
    io.to(room).emit('message', message);
  });

  socket.on('nickname', async (data) => {
    const { prevNick, nickname, room } = data;
    console.log(data, room)
    if (prevNick) {
      onlineUsers = onlineUsers.filter(
        ({ nickname: nick }) => nick !== prevNick
      );
    }
    onlineUsers.push({ nickname, id: socket.id, room });

    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    // aki fazer o user ficar off
    onlineUsers = onlineUsers.filter(({ id }) => id !== socket.id);
    io.emit('onlineUsers', onlineUsers);
  });
});

http.listen(3000, () => console.log('Listening on 3000!'));
