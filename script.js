const moment = require('moment');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// const { registerUser } = require('./model/user');
const { registerMessage, retrieveMessages } = require('./model/messages');

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

// const saveMessage = async (msg, nickname) => {
//   // salva mensagens no banco de dados
// };

io.on('connection', async (socket) => {
  console.log('New User: ', socket.id);
  // pega o histórico de mensagens
  const messages = await retrieveMessages();
  io.to(socket.id).emit('history', messages);
  // aki fazer o user ficar on salvando no banco
  // await saveUser(socket.nickname, socket.id);
  socket.on('disconnect', (e) => {
    // aki fazer o user ficar off
    console.log(e);
  });
  // aki ele emite pra geral a mensagem
  socket.on('message', async ({ chatMessage, nickname }) => {
    // salvar mensagem no banco de dados e retornar a hora
    console.log(chatMessage);
    const time = moment().format('DD-MM-YYYY hh:mm:ss');
    const message = `${nickname} - ${time} - ${chatMessage}`;
    await registerMessage(message);
    io.emit('message', message);
  });
});

http.listen(3000, () => console.log('Listening on 3000!'));
