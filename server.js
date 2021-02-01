const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const moment = require('moment');

// inicializando app express
const app = express();
// inicializando servidor http
const http = require('http').createServer(app);
// inicializando socket.io, passando informações do servidor e options de conexão
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
require('dotenv').config();

const { messages } = require('./controllers');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

// rotas
app.post('/msg', messages.saveMessages);
app.get('/msg', messages.getMessages);

const onlineUsers = [];

io.on('connection', (socket) => {
  // utilizando axios para obter histórico de mensagens
  axios({
    method: 'GET',
    url: 'http://localhost:3000/msg',
  }).then(({ data }) => socket.emit('messages-history', data));

  socket.emit('online-users', onlineUsers);

  socket.on('user-nickname', ({ nickname: newUser }) => {
    /* criando id do usuário utilizando o atributo id da instância do socket.io
    conforme: https://socket.io/docs/v3/server-socket-instance/#Socket-id */
    onlineUsers.push({ name: newUser, id: socket.id });
    // informa ao novo usuário que ele está online
    socket.emit('new-online-user', newUser);
    // informa demais usuários que existe um novo usuário online
    socket.broadcast.emit('new-online-user', newUser);
  });

  socket.on('disconnect', () => {
    // procura id de usuário desconectado no array de usuários online
    const index = onlineUsers.map(({ id }) => id).indexOf(socket.id);
    // Existindo utiliza array.splice para retirar o usuário da lista
    if (index !== -1) onlineUsers.splice(index, 1);
    // emite aos demais usuários nova lista de usuários online
    socket.broadcast.emit('new-online-list', onlineUsers);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const message = `${moment(new Date()).format(
      'DD-MM-yyyy hh:mm:ss',
    )} - ${nickname} -> ${chatMessage}`;

    axios({
      method: 'POST',
      url: 'http://localhost:3000/msg',
      data: {
        message,
      },
    });

    socket.emit('message', message);
    socket.broadcast.emit('message', message);
  });
});

http.listen(PORT, () => console.log(`Listening on port ${PORT}`));
