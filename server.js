require('dotenv/config');

const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const { getAllMessage, saveMessage } = require('./models/messageModel');

const { PORT } = process.env;

app.use(express.static(path.join(__dirname, 'client')));

app.use('/', (_req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
});

io.on('connection', async (socket) => {
  const previousMessage = await getAllMessage();

  previousMessage.forEach(({ chatMessage, timestamp, nickname }) => {
    const messageToSend = `${nickname} ${timestamp} ${chatMessage}`;
    socket.emit('history', messageToSend);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    console.log(nickname);
    const time = new Date();
    const timeEdited = moment(time).format('D-M-yyyy hh:mm:ss');
    const renderMessages = `${nickname} ${timeEdited} ${chatMessage}`;

    io.emit('message', renderMessages);
    // socket.broadcast.emit('message', renderMessages);

    return saveMessage(chatMessage, nickname, timeEdited);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
