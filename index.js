const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { updateUser } = require('./model/userModel');
const { registerMessage } = require('./model/messageModel');
const connection = require('./model/connection');

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', async (socket) => {
  console.log('Conectado');

  const userId = socket.id;
  const db = await connection();
  await updateUser(userId, 'random');

  socket.on('nick', async ({ nick }) => updateUser(userId, nick));

  socket.on('message', async (data) => {
    const { message } = data;
    const timestamp = Date.now();
    const user = await db.collection('users').findOne({ userId: socket.id });
    const { _id: mongoId, userId, nick } = user;
    await registerMessage(nick, message, timestamp);
    io.emit('messageServer', { chatMessage: { message, timestamp }, nick });
  });

  socket.broadcast.emit('messageServer');

  socket.on('disconnect', () => {
    io.emit('adeus', { mensagem: 'Poxa, fica mais, vai ter bolo :)' });
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
