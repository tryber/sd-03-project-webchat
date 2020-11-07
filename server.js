const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
app.use(bodyParser.json());

app.use('/', express.static('./public', { extensions: ['html'] }));

const { PORT = 3000 } = process.env;
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log(`${socket.id} conectado`);

  socket.on('SendMessage', (data) => {
    console.log(data);
    socket.broadcast.emit('msgRecebida', data);
  });
});

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
