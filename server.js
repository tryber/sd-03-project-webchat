const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');
const { saveMessage } = require('./model');

const app = express();
app.use(bodyParser.json());

app.use('/', express.static('./public', { extensions: ['html'] }));

const { PORT = 3000 } = process.env;
const server = http.createServer(app);
const io = socketIo(server);

app.get('/ping', async (_req, res) => {
  const msg = await saveMessage('nickname', 'chatMessage');
  return res.status(200).json(msg);
});

io.on('connection', (socket) => {
  console.log(`${socket.id} conectado`);
  socket.on('message', async (data) => {
    console.log(data);
    socket.broadcast.emit('msgRecebida', data);
    const { nickname, chatMessage, dataActualy } = data;
    await saveMessage(nickname, chatMessage, dataActualy);
  });
});

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
