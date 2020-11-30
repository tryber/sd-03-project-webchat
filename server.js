const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const { createMessage } = require('./models/messagesModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

io.on('connection', (socket) => {
  const randomName = uniqueNamesGenerator({ dictionaries: [names] });
  socket.on('message', (chatMessage, nickname = randomName) => {
    const time = new Date();
    const timestamp = `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`;
    const fullMessage = `${timestamp} - ${nickname}: ${chatMessage}`;

    io.emit('messageServer', fullMessage);
    return createMessage(chatMessage, nickname, timestamp);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Lintening on ${PORT}`);
});
