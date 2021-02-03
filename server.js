const express = require('express');
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
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

// rotas
app.post('/msg', messages.saveMessages);
app.post('/msg-private', messages.savePrivateMessages);
app.get('/msg', messages.getMessages);
app.get('/msg-private', messages.getPrivateMessages);

/* troquei o array por um objeto para facilitar localização do usuário
e operação de atualização de informações */
const onlineUsers = {};

io.on('connection', async (socket) => {
  // utilizando axios para obter histórico de mensagens sem acionar diretamente o model
  await axios({
    method: 'GET',
    url: `http://localhost:${PORT}/msg`,
  }).then(({ data }) => socket.emit('messages-history', data));

  // evento de conexão do usuário
  socket.on('user-connection', (user) => {
    onlineUsers[socket.id] = user;
    socket.emit('online-users', onlineUsers);
  });

  socket.on('update-nickname', (nickname) => {
    /* criando id do usuário utilizando o atributo id da instância do socket.io
    conforme: https://socket.io/docs/v3/server-socket-instance/#Socket-id */
    onlineUsers[socket.id] = nickname;
    // informa ao novo usuário que ele está online
    socket.emit('updated-online-list', onlineUsers);
    // informa demais usuários que existe um novo usuário online
    socket.broadcast.emit('updated-online-list', onlineUsers);
  });

  socket.on('disconnect', () => {
    // deletando usuário desconectado
    delete onlineUsers[socket.id];
    // emite aos demais usuários nova lista de usuários online
    socket.broadcast.emit('updated-online-list', onlineUsers);
  });

  socket.on('message', async ({ chatMessage, nickname, receiver }) => {
    let message;
    // criando timestamp usando momentJS
    const date = moment(new Date()).format('DD-MM-yyyy hh:mm:ss');

    if (!receiver) {
      // formatando mensagem para o chat
      message = `${date} - ${nickname} => ${chatMessage}`;

      await axios({
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
    } else {
      // formatando mensagem para o chat
      message = `${date} (private message) - ${nickname} => ${chatMessage}`;

      await axios({
        method: 'POST',
        url: `http://localhost:${PORT}/msg-private`,
        data: {
          message: chatMessage,
          nickname,
          receiver,
          date,
        },
      });

      socket.emit('message', message);
      socket.broadcast.emit('message', message);
    }
  });

  socket.on('private-chat', (user, nickname, chatMessage) => {
    const message = `${moment(new Date()).format(
      'DD-MM-yyyy hh:mm:ss',
    )} - ${nickname} -> ${chatMessage}`;
    const { socket: id } = onlineUsers.find(
      (onlineUser) => onlineUser.socket === user,
    );
    io.to(socket.id).emit('message', message, [id, socket.id]);
  });
});

http.listen(PORT, () => console.log(`Listening on port ${PORT}`));
