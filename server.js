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
app.get('/msg', messages.getMessages);

/* troquei o array por um objeto para facilitar localização do usuário
e operação de atualização de informações */
const onlineUsers = {};

io.on('connection', async (socket) => {
  // utilizando axios para obter histórico de mensagens sem acionar diretamente o model
  const messagesHistory = await axios({
    method: 'GET',
    url: `http://localhost:${PORT}/msg`,
  });

  socket.emit('messages-history', messagesHistory.data);

  // evento de conexão do usuário
  socket.on('user-connection', async (user) => {
    onlineUsers[socket.id] = user;
    io.emit('online-users', onlineUsers);
  });

  socket.on('update-nickname', async (nickname) => {
    /* criando id do usuário utilizando o atributo id da instância do socket.io
    conforme: https://socket.io/docs/v3/server-socket-instance/#Socket-id */
    onlineUsers[socket.id] = nickname;
    io.emit('online-users', onlineUsers);
  });

  socket.on('disconnect', async () => {
    // deletando usuário desconectado
    delete onlineUsers[socket.id];
    // emite nova lista de usuários online
    io.emit('online-users', onlineUsers);
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

      io.emit('message', message);
    } else {
      // formatando mensagem para o chat
      message = `${date} (private message to: ${receiver}) - ${nickname} => ${chatMessage}`;

      io.to(receiver).to(socket.id).emit('message', message, receiver, nickname);
    }
  });
});

http.listen(PORT, () => console.log(`Listening on port ${PORT}`));
