const app = require('express')();
const express = require('express');
const httpserver = require('http').createServer(app);
const iosocket = require('socket.io')(httpserver);
const userController = require('./controller/userController');
// Impostando o socket dentro do servidor html para permitir a conexão do cliente ao servidor

app.use(express.static('htm'));
// Permite o carregamento de arquivos como folhas de estilo p. ex. Sem isso, o Express bloqueia

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/htm/index.html`);
});

iosocket.on('connection', (socket) => {
  socket.broadcast.emit('newUserMsg', userController.generateUser());

  socket.on('message', (msg) => {
    iosocket.emit('message', msg); // Manda uma mensagem p/ os clientes
  });

  socket.on('userRename', (names) => {
    iosocket.emit('userRename', names);
  });

  socket.on('disconnect', () => {
    iosocket.emit('userLogOff', { mensagem: 'Desconectado com sucesso' });
  });
});

httpserver.listen(3000, () => {
  console.log('Servidor do Express ouvindo na porta 3000');
});

iosocket.listen(5500, () => {
  console.log('Socket.io server ouvindo na porta 5500');
});
