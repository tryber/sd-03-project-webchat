const express = require('express');
// const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const socketIOServer = http.createServer();
const io = socketIo(socketIOServer);

const app = express();

app.post('/message', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(422).json({ message: 'Missing message text ' });
  }

  io.emit('message', message);

  res.status(200).json({ message: 'Message sent' });
});

app.listen(3000, () => {
  console.log('App escutando na porta 3000');
});

socketIOServer.listen(4555, () => {
  console.log('Socket.io escutando na porta 4555');
});
