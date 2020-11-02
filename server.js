const path = require('path');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { add, listAll } = require('./models/messageModel');

let onlineArray = [];

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', async (socket) => {
  console.log('Conectado!');
  const history = await listAll();

  socket.emit('history', history);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const msgDate = date.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const msgTime = date.toLocaleTimeString('pt-BR');

    await add(`${msgDate} - ${msgTime} | ${nickname}: ${chatMessage}`);

    io.emit('message', `${msgDate} - ${msgTime} | ${nickname}: ${chatMessage}`);
  });

  socket.on('userConnected', (nickname) => {
    onlineArray.push({ id: socket.id, nickname });
    io.emit('userList', onlineArray);
  });

  socket.on('nameChange', (nickname) => {
    const index = onlineArray.findIndex((e) => e.id === socket.id);
    onlineArray[index].nickname = nickname;
    io.emit('userList', onlineArray);
  });

  socket.on('disconnect', () => {
    onlineArray = onlineArray.filter((e) => e.id !== socket.id);
    io.emit('userList', onlineArray);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
