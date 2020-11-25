const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { registerUser, getUserById } = require('./model/user');

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

const saveUser = async (nick, id) => {
  // salva usuário no banco para sinalizar que está online
};

const saveMessage = async (msg, nickname) => {
  // salva mensagens no banco de dados
};

io.on('connection', async (socket) => {
  // aki fazer o user ficar on salvando no banco
  console.log('New User: ', socket.id.substring(socket.id.length - 4));
  await saveUser(socket.nickname, socket.id);
  // aki fazer o user ficar off
  socket.on('disconnect', (e) => {
    console.log(e);
  });
  // aki ele emite pra geral a mensagem
  socket.on('message', ({ chatMessage, nickname }) => {
    // salvar mensagem no banco de dados e retornar a hora
    console.log(chatMessage);
    const time = new Date();
    io.emit('serverMessage', `${nickname} ${time} ${chatMessage}`);
  });
});

http.listen(3000, () => console.log('Listening on 3000!'));
