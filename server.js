const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
require('dotenv/config');

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('client connected');

  socket.emit('message', 'HelO!');
});

app.post('/', (req, res) => {
  const { title, message } = req.body;
  console.log(req.body);
  io.emit('notification', { title, message });
  res.status(200).json({ ok: true })
});

const { PORT = 3000 } = process.env.PORT;

server.listen(PORT, () => console.log(`Escutando na porta ${PORT}`));
