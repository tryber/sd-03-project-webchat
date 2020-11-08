const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');
const moment = require('moment');
const { saveMessage } = require('./model');

const app = express();
app.use(bodyParser.json());

app.use('/', express.static('./public', { extensions: ['html'] }));

const { PORT = 3000 } = process.env;
const server = http.createServer(app);
const io = socketIo(server);

/* app.get('/ping', async (_req, res) => {
  const msg = await allMessage({});
  return res.status(200).json({msg});
}); */
const date = new Date();
const datenow = moment(date).format('DD-MM-yyyy hh:mm:ss');

io.on('connection', (socket) => {
  console.log(`${socket.id} conectado`);
  socket.on('message', async (data) => {
    console.log(data);
    socket.broadcast.emit('msgRecebida', data, datenow);
    const { nickname, chatMessage } = data;
    await saveMessage(nickname, chatMessage, datenow);
  });
});

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
