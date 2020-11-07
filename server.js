const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
app.use(bodyParser.json());

app.use('/', express.static('./public', { extensions: ['html'] }));

const { PORT = 3000 } = process.env;

const server = http.createServer(app);

const io = socketIo(server);


app.post('/message', (req, res) => {
  const { chatMessage } = req.body;

  io.emit('message',chatMessage);
  res.status(200).json({ ok: true })
});

io.on('connection', (socket) => {
  console.log(`${socket.id} conectado`);

  socket.on('SendMessage',data => {
    console.log(data);
  });
})

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
