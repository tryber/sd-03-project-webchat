const app = require('express')();
const express = require('express');
const httpserver = require('http').createServer(app);
const iosocket = require('socket.io')(httpserver);
// Impostando o socket dentro do servidor html para permitir a conexão do cliente ao servidor

const userController = require('./controller/userController');
const messageController = require('./controller/messageController');
const { swapUserFromList } = require('./controller/userController');

let onlineSrvUsers = ['Armando', 'Marcílio', 'Lupercio', 'Eliton', 'Rafael', 'Ronaldo', 'Pablo'];

app.use(express.static('htm'));
// Permite o carregamento de arquivos como folhas de estilo p. ex. Sem isso, o Express bloqueia

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/htm/index.html`);
});

iosocket.on('connection', (socket) => {
  userController.generateUser(socket);
  messageController.getAll(socket);
  socket.emit('getUserList', onlineSrvUsers);

  // Envio de mensagem para os clientes
  socket.on('message', (msg) => {
    messageController.formatAndInsert(msg, iosocket);
  });

  // Cliente trocou de nome
  socket.on('userRename', (names) => {
    onlineSrvUsers = swapUserFromList(names);
    console.log('Chamou', onlineSrvUsers);
    iosocket.emit('userRename', onlineSrvUsers);
  });

  // Cliente desconectou
  socket.on('disconnect', () => {
    iosocket.emit('userLogOff', { mensagem: 'Desconectado com sucesso' });
  });
});

httpserver.listen(3000, () => { console.log('Servidor do Express ouvindo na porta 3000'); });

iosocket.listen(5500, () => { console.log('Socket.io server ouvindo na porta 5500'); });
