const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
require('dotenv/config');

const app = express();
app.use(bodyParser);
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('client connected');

  socket.emit('message', 'HelO!');
});

// app.get('/', (req, res) => {
//   res.sendFile(__dirname, '/index.html');
// });

const { PORT = 3000 } = process.env.PORT;

server.listen(PORT, () => console.log(`Escutando na porta ${PORT}`));
