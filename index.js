const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const connection = require('./tests/helpers/db');

app.use(express.urlencoded({ extended: true }));

const createStructure = async () => {
  try {
    await connection.createCollection('messages');
    console.log('Banco criado');
  } catch (error) {
    console.log('Banco já existe');
  }
};

createStructure();

app.use('/', express.static(`${__dirname}`));
app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/views/login.html`);
});
app.post('/chat', async (req, res) => {
  const getAll = await connection().then((db) =>
    db.collection('messages').find({}).toArray(),
  );
  const arrayMessages = getAll.map((message) => ({
    chatMessage: message.chatMessage,
    nickname: message.nickname,
  }));
  console.log(arrayMessages, 'array');
  res.sendFile(`${__dirname}/public/views/index.html`);
  io.on('connection', (socket) => {
    socket.on('message', (msg) => {
      console.log(msg);
      socket.broadcast.emit({ chatMessage: msg });
      connection()
        .then((db) =>
          db
            .collection('messages')
            .insertOne({ chatMessage: msg, nickname: req.body.nickname }),
        )
        .catch((e) => console.log(e));
      io.emit('message', msg);
    });
  });
});
io.on('connection', (_socket) => {
  console.log('A user connected');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
