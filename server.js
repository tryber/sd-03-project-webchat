const http = require('http');
// const socketIo = require('socket.io');
const path = require('path');
const express = require('express');

// const controllers = require("./controllers");

const app = express();
app.use(express.json());
app.use(
  '/',
  express.static(path.join(__dirname, 'public_html'), { extensions: ['html'] }),
);

const httpServer = http.createServer(app);
// const io = socketIo(httpServer);
// let onlineUsers = [];

httpServer.listen(3000, () => console.log('Server HTTP ouvindo na porta 3000'));
