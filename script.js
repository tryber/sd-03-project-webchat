const moment = require('moment');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { registerMessage, retrieveMessages } = require('./model/messages');

let onlineUsers = [];

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

const generateRndNick = () => {
  // adaptado da primeira resposta deste link
  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  const nickname = [];
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const charsLen = 26;
  for (let i = 0; i < 6; i += 1) {
    nickname.push(chars.charAt(Math.floor(Math.random() * charsLen)));
  }
  return nickname.join('');
};

const newUser = (socket, all) => {
  const user = { id: socket.id, nickname: generateRndNick() };
  onlineUsers.push(user);
  socket.emit('newUser', user.nickname);
  all.emit('onlineUsers', onlineUsers);
};

io.on('connection', async (socket) => {
  newUser(socket, io);
  // place the user on the public room
  // socket.join('public');
  // pega o histórico de mensagens
  const chatHistory = await retrieveMessages('public');
  socket.emit('history', chatHistory);

  socket.on('changeRoom', async () => {
    const messages = await retrieveMessages();
    socket.emit('history', messages);
  });

  socket.on('message', async (data) => {
    const { chatMessage, nickname, receiver } = data;
    const time = moment().format('DD-MM-YYYY hh:mm:ss');
    const message = `${time} - ${nickname}: ${chatMessage}`;
    if (receiver) {
      return io
        .to(receiver)
        .emit('privateMessage', { message, from: nickname });
    }
    await registerMessage(message);
    return io.emit('message', message);
  });

  socket.on('nickname', async (newNick) => {
    onlineUsers.map((user) => {
      const newNickname = user;
      if (user.id === socket.id) {
        newNickname.nickname = newNick;
      }
      return user;
    });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    // aki fazer o user ficar off
    onlineUsers = onlineUsers.filter(({ id }) => id !== socket.id);
    io.emit('onlineUsers', onlineUsers);
  });
});

http.listen(3000, () => console.log('Listening on 3000!'));
