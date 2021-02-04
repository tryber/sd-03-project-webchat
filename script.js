const moment = require('moment');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { registerMessage, retrieveMessages } = require('./model/messages');

let onlineUsers = [];

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

// TODO: implement the join in room function
io.on('connection', async (socket) => {
  // place the user on the public room
  socket.join('public');

  // checks to retrieve the correct messages

  socket.emit('onlineUsers', onlineUsers);
  // pega o histórico de mensagens
  const chatHistory = await retrieveMessages('public');
  socket.emit('history', chatHistory);

  socket.on('changeRoom', async ({ to, from, room }) => {
    console.log(to, from, room);
    // socket.leaveAll();
    // socket.join(room);
    const messages = await retrieveMessages();
    io.to(room).emit('history', messages);
  });

  socket.on('message', async (data) => {
    const { chatMessage, nickname, room = 'public' } = data;
    const time = moment().format('DD-MM-YYYY hh:mm:ss');
    // const client = onlineUsers.find((user) => user.nickname === nickname);
    const message = `${time} - ${nickname}: ${chatMessage}`;
    await registerMessage(message, nickname, room);
    io.to(room).emit('message', message);
  });

  socket.on('nickname', async (data) => {
    const { prevNick, nickname, room } = data;
    console.log(data, room);
    if (prevNick) {
      onlineUsers = onlineUsers.filter(
        ({ nickname: nick }) => nick !== prevNick,
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
