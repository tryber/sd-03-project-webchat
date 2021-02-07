const moment = require('moment');
const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const faker = require('faker');

const { registerMessage, retrieveMessages } = require('./models/messages');

// array de objetos de usuários que estão online com
let onlineUsers = [];

// Temos apenas um endpoint para servir o index.html
app.use(express.static('public'));
app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

// função para criar novo usuário com nome aleatório, guardar ele na array e emitir para os sockets
const newUser = (socket, all) => {
  const fakeUser = faker.name;
  const user = {
    id: socket.id,
    nickname: `${fakeUser.firstName()}${fakeUser.jobDescriptor().split(' ')[0]}`,
  };
  onlineUsers.push(user);
  socket.emit('newUser', user.nickname);
  all.emit('onlineUsers', onlineUsers);
};

// quando alguém se conecta...
io.on('connection', async (socket) => {
  // novo usuário aleatório da linha 16;
  newUser(socket, io);
  // envia o histórico de mensagens para o canal publico:
  const chatHistory = await retrieveMessages('public');
  socket.emit('history', chatHistory);

  // quando houver a mudança de sala, pega as mensagens
  // do histórico e manda outra vez para o socker que chamou
  socket.on('changeRoom', async () => {
    const messages = await retrieveMessages();
    socket.emit('history', messages);
  });

  // quando há uma nova mensagem
  socket.on('message', async (data) => {
    // pega os dados estruturados e os desestrutura
    const { chatMessage, nickname, receiver } = data;
    // cuida da data formatada:
    const time = moment().format('DD-MM-YYYY hh:mm:ss');
    // formata a mensagem:
    const message = `${time} - ${nickname}: ${chatMessage}`;
    // se a mensagem tiver um receptor específico, emite a mensagem
    // com um campo a mais de quem a enviou
    if (receiver) {
      return io.to(receiver).emit('privateMessage', { message, from: nickname });
    }
    // registra a mensagem no banco
    await registerMessage(message);
    // retorna a mensagem para o socket
    return io.emit('message', message);
  });

  // Aqui nós cuidamos de quando o nick de um usuário muda:
  socket.on('nickname', async (newNick) => {
    const olu = onlineUsers.map((user) => {
      // salva o nome de usuário
      const newNickname = user;
      // percorre a array até achar um nick que tenha o mesmo socketID, quando encontra, muda o nick
      if (user.id === socket.id) {
        newNickname.nickname = newNick;
      }
      // retorna o usuário caso não caia no if
      return user;
    });
    // emite a lista de usuários logados
    io.emit('onlineUsers', olu);
  });

  // o usuário se desconecta
  socket.on('disconnect', () => {
    // filtra a lista de usuários online o retirando da mesma
    onlineUsers = onlineUsers.filter(({ id }) => id !== socket.id);
    // retorna a lista filtrada
    io.emit('onlineUsers', onlineUsers);
  });
});

http.listen(3000, () => console.log('Listening on 3000!'));
