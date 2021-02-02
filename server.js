const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const moment = require('moment');
// Definindo porta padrão da aplicação
const PORT = process.env.PORT || 3000;
// inicializando app express
const app = express();
// inicializando servidor http
const http = require('http').createServer(app);
// inicializando socket.io, passando informações do servidor e options de conexão
const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});
require('dotenv').config();

const { messages } = require('./controllers');
// middleware para habilitar Cross-origin resource sharing
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));

// rotas
app.post('/msg', messages.saveMessages);
app.get('/msg', messages.getMessages);

const onlineUsers = [];

io.on('connection', (socket) => {
  // utilizando axios para obter histórico de mensagens
  axios({
    method: 'GET',
    url: `http://localhost:${PORT}/msg`,
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
    socket.broadcast.emit('updated-online-list', onlineUsers);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = moment(new Date()).format('DD-MM-yyyy hh:mm:ss');
    const message = `${date} - ${nickname} => ${chatMessage}`;

    axios({
      method: 'POST',
      url: `http://localhost:${PORT}/msg`,
      data: {
        message: chatMessage,
        nickname,
        date,
      },
    });

    socket.emit('message', message);
    socket.broadcast.emit('message', message);
  });

  socket.on('private-chat', (user, nickname, chatMessage) => {
    const message = `${moment(new Date()).format(
      'DD-MM-yyyy hh:mm:ss',
    )} - ${nickname} -> ${chatMessage}`;
    const { socket: id } = onlineUsers.find(
      (onlineUser) => onlineUser.socket === user,
    );
    io.to(id).to(socket.id).emit('message', message, [id, socket.id]);
  });
});

http.listen(PORT, () => console.log(`Listening on port ${PORT}`));
