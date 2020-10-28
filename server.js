require('dotenv').config();

const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer);
const express = require('express');
const path = require('path');

const app = express();

const { PORT, IOPORT } = process.env;

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));

socketServer.listen(IOPORT, () => console.log(`Socket na port ${IOPORT}`));
