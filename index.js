const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { updateUser, removeUser, getUsers } = require('./model/userModel');
const { registerMessage, getHistory } = require('./model/messageModel');
const connection = require('./model/connection');

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', async (socket) => {
  console.log('Conectado');

  const userId = socket.id;
  const db = await connection();

  socket.on('nick', async ({ nickname }) => updateUser(userId, nickname));

  const history = await getHistory();
  io.emit('history', { history });

  const users = await getUsers();
  io.emit('userList', { users });

  socket.on('message', async (data) => {
    const { chatMessage } = data;
    let timestamp = new Date(Date.now());
    timestamp = timestamp.toLocaleString('pt-BR');
    const user = await db.collection('users').findOne({ userId: socket.id });
    // const { _id: mongoId, userId, nickname } = user;
    const { nickname } = user;
    await registerMessage(nickname, chatMessage, timestamp);
    io.emit('messageServer', { chatMessage, timestamp, nickname });
  });

  // socket.broadcast.emit('messageServer');

  socket.on('disconnect', async () => {
    removeUser(userId);
    socket.broadcast.emit('userDisconnected', { users: await getUsers() });
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
