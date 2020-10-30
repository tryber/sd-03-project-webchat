const net = require('net');

const port = 3000;
const sockets = [];
let guestId = 0;
const broadcastMessage = (from, message) => {
  sockets
    .filter((socket) => socket.guest !== from)
    .forEach((socket) => socket.write(message));
};

const onNewconnection = (socket) => {
  guestId++;
  socket.guest = `Guest ${guestId}`;
  sockets.push(socket);
  socket.write('boas vindas ao chat !');
  broadcastMessage(socket.guest, `${socket.guest} entrou no chat`);
  socket.on('end', () => {
    sockets.splice(sockets.indexOf(socket), 1);
    const message = `${socket.guest} deixou o chat`;
    broadcastMessage(socket.guest, message);
  });
  socket.on('data', (data) => {
    const message = `${socket.guest} > ${data.toString('utf-8')}`;
    broadcastMessage(socket.guest, message);
  });
  socket.on('error', (err) => console.log('Erro no socket', err));
};

const server = net.createServer(onNewconnection);

server.on('error', (err) => console.log('Erro no server', err));

server.listen(port, () => console.log('server listening on', port));
