const app = require('express')();
const express = require('express');
const httpserver = require('http').createServer(app);
const io = require('socket.io')(httpserver);
// Importando o socket dentro do servidor HTTP para permitir a conexão do cliente ao servidor

const messageController = require('./controller/messageController');
const {
  insertIntoList,
  swapFromList,
  generateRandom,
  removeFromList,
} = require('./controller/userController');

let onlineSrvUsers = [];

// io.emit - envia/recebe para/de todos
// socket.emit - envia para um contexto específico daquele socket

app.use(express.static('htm'));
// Permite o carregamento de arquivos como folhas de estilo p. ex. Sem isso, o Express bloqueia

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/htm/index.html`);
});

io.on('connection', (socket) => { // `socket` é num escopo de quem conectar
  const newNickname = generateRandom();
  insertIntoList(newNickname, io, socket.id, onlineSrvUsers);
  socket.emit('syncNewNick', newNickname);
  console.log(newNickname, 'conectou-se');

  messageController.getAll(socket);
  socket.emit('syncOnlineUsers', onlineSrvUsers);

  // Envio de mensagem para os clientes
  socket.on('message', (msg) => {
    messageController.formatAndInsert(msg, io);
  });

  // Cliente trocou de nome
  socket.on('userRename', (names) => {
    onlineSrvUsers = swapFromList(names, socket.id);
    io.emit('listsync', onlineSrvUsers);
    io.emit('userRename', names);
  });

  // Algum cliente se desconectou
  socket.on('disconnect', () => {
    console.log(socket.id, 'desconectou-se');
    onlineSrvUsers = removeFromList(onlineSrvUsers, socket.id);
    io.emit('listsync', onlineSrvUsers);
  });
});

httpserver.listen(3000, () => { console.log('Servidor HTTP ouvindo na porta 3000'); });
// io.listen(5500, () => { console.log('Socket.io server ouvindo na porta 5500'); });
