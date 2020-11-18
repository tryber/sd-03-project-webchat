const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { updateUser, removeUser, getUsers, deleteUsers } = require('./model/userModel');
const { registerMessage, getHistory, deleteMessages } = require('./model/messageModel');
const connection = require('./model/connection');

// clears users DB
deleteUsers();
deleteMessages();

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', async (socket) => {
  console.log('Conectado');

  const refreshUserList = () => setTimeout(async () => {
    const users = await getUsers();
    io.emit('userList', { users });
  }, 750);

  const userId = socket.id;
  const db = await connection();

  socket.on('registerNick', async ({ nickname }) => updateUser(userId, nickname).then(() => refreshUserList()));

  const history = await getHistory();
  io.emit('history', { history });

  socket.on('message', async (data) => {
    const { chatMessage, nickname, timestamp } = data;
    await registerMessage(nickname, chatMessage, timestamp);
    io.emit('messageServer', { chatMessage, timestamp, nickname });
  });

  socket.on('disconnect', async () => removeUser(userId).then(async () => refreshUserList()));
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
