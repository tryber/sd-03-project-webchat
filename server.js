// const app = require('express')();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);

// app.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/index.html`);
// });

// io.on('connection', (socket) => {
//   console.log('Conectado');
//   socket.on('disconnect', () => {
//     // io.emit('message',
//     // { message: 'Um usuário deixou o chat :(', username: 'Sistema', color: 'red' });
//     console.log('Um usuário deixou o chat :(');
//   });

//   socket.on('onMessage', ({ chatMessage, nickname, color }) => {
//     io.emit('message', { chatMessage, nickname, color });
//   });
// });

// http.listen(3000, () => {
//   console.log('Servidor ouvindo na porta 3000');
// });

const httpFactory = require('./http');
const socketFactory = require('./socket');

const { ioServer, io } = socketFactory();
const http = httpFactory(io);

http.listen(3001, () => { console.log('HTTP listening on 3001'); });
ioServer.listen(3000, () => { console.log('Socket.io listening on 3000'); });
