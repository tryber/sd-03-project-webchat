const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const connect = require('./models/connection');

app.use(bodyParser.json());
app.use('/client', express.static(path.join(__dirname, '/index.html'), { extensions: ['html'] }));

app.get('/', (_req, res) => {
  io.on('connection', (socket) => {
    console.log('aqui');
    socket.on('message', ({ chatMessage, nickname }) => {
      console.log('teste', chatMessage, nickname);
      return connect()
        .then((db) => db.collection('webchat').insertOne({ chatMessage, nickname }));
    });

    socket.on('message', (data) => {
      socket.broadcast.emit('message', data);
    });
  });
  return res.status(200);
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
