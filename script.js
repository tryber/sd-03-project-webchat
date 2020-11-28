const moment = require('moment');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const {
  registerMessage,
  retrievePublicMessages,
  retrievePrivateMessages,
} = require('./model/messages');

let onlineUsers = [];

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

io.on('connection', async (socket) => {
  io.to(socket.id).emit('allOnline', onlineUsers);
  // pega o histórico de mensagens
  const messages = await retrievePublicMessages();
  // const privateMessages = await retrievePrivateMessages();
  io.to(socket.id).emit('history', messages);
  // io.to(socket.id).emit('privateHistory', privateMessages);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const time = moment().format('DD-MM-YYYY hh:mm:ss');
    const message = `${nickname} - ${time} - ${chatMessage}`;
    await registerMessage(message);
    io.emit('message', message);
  });

  // socket.on('privateMessage', async ({ chatMessage, nickname }) => {
  //   const time = moment().format('DD-MM-YYYY hh:mm:ss');
  //   const message = `${nickname} - ${time} - ${chatMessage}`;
  //   await registerMessage(message);
  //   io.emit('privateMessage', message);
  // });

  socket.on('nickname', async ({ prevNick, nickname }) => {
    if (prevNick) {
      onlineUsers = onlineUsers.filter(({ nickname: nick }) => nick !== prevNick);
    }
    onlineUsers.push({ nickname, id: socket.id });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    // aki fazer o user ficar off
    onlineUsers = onlineUsers.filter(({ id }) => id !== socket.id);
    io.emit('onlineUsers', onlineUsers);
  });
});

http.listen(3000, () => console.log('Listening on 3000!'));
