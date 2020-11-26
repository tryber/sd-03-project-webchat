const moment = require('moment');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { registerMessage, retrieveMessages } = require('./model/messages');
const { registerUser, retrieveUsers } = require('./model/user');

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

io.on('connection', async (socket) => {
  // pega o histórico de mensagens
  const messages = await retrieveMessages();
  io.to(socket.id).emit('history', messages);
  // aki fazer o user ficar on salvando no banco
  socket.on('disconnect', (e) => {
    // aki fazer o user ficar off
    console.log(e);
  });
  // aki ele emite pra geral a mensagem
  socket.on('message', async ({ chatMessage, nickname }) => {
    // salvar mensagem no banco de dados e retornar a hora
    const time = moment().format('DD-MM-YYYY hh:mm:ss');
    const message = `${nickname} - ${time} - ${chatMessage}`;
    await registerMessage(message);
    io.emit('message', message);
  });
  socket.on('nickname', async () => {
    
  });
});

http.listen(3000, () => console.log('Listening on 3000!'));
