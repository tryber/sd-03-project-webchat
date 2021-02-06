const express = require('express');
const cors = require('cors');
const path = require('path');
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

const { messages } = require('./services');
// middleware para habilitar Cross-origin resource sharing
app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

/* troquei o array por um objeto para facilitar localização do usuário
e operação de atualização de informações */
const onlineUsers = {};

io.on('connection', async (socket) => {
  // utilizando axios para obter histórico de mensagens sem acionar diretamente o model
  const messagesHistory = await messages.getMessages();

  socket.emit('messages-history', messagesHistory);

  // evento de conexão do usuário
  socket.on('user-connection', async (user) => {
    onlineUsers[socket.id] = user;
    return io.emit('online-users', onlineUsers);
  });

  socket.on('update-nickname', async (nickname) => {
    /* criando id do usuário utilizando o atributo id da instância do socket.io
    conforme: https://socket.io/docs/v3/server-socket-instance/#Socket-id */
    onlineUsers[socket.id] = nickname;
    return io.emit('online-users', onlineUsers);
  });

  socket.on('disconnect', async () => {
    // deletando usuário desconectado
    delete onlineUsers[socket.id];
    // emite nova lista de usuários online
    return io.emit('online-users', onlineUsers);
  });

  socket.on('message', async ({ chatMessage, nickname, receiver }) => {
    let message;
    // criando timestamp usando momentJS
    const date = moment(new Date()).format('DD-MM-yyyy hh:mm:ss');

    if (!receiver) {
      // formatando mensagem para o chat
      message = `${date} - ${nickname} => ${chatMessage}`;

      await messages.saveMessages({ message: chatMessage, nickname, date });

      return io.emit('message', message);
    }
    // formatando mensagem para o chat
    message = `${date} (private message from: ${nickname} => ${chatMessage}`;

    return io.to(receiver)
      .to(socket.id)
      .emit('message', message, receiver, nickname);
  });
});

http.listen(PORT, () => console.log(`Listening on port ${PORT}`));
