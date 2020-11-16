const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

const saveMessage = (msg, nickname) => {
  // salva mensagens no banco de dados
};

io.on('connection', (socket) => {
  // aki fazer o user ficar on
  // aki fazer o user ficar off
  socket.on('disconnect', () => {});
  // aki ele emite pra geral a mensagem
  socket.on('message', ({ chatMessage, nickname }) => {
    // salvar mensagem no banco de dados e retornar a hora
    const time = '21/10/1999 05:23';
    io.emit('serverMessage', `${nickname}${time}${chatMessage}`);
  });
});

http.listen(3000, () => console.log('Listening on 3000!'));
