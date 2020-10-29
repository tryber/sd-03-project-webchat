const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { getAllMessages } = require('./services/messageServices');
const messageController = require('./controllers/messageController');

app.use('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

io.on('connection', async (socket) => {
  socket.on('message', (data) => messageController.sendMessage(io, data));
  socket.emit('history', await getAllMessages());
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});
