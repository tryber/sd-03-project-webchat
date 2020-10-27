const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
// const bodyParser = require('body-parser');

function start({ PORT = 3000 }, socketFunction) {
  const app = express();
  // app.use(bodyParser.json());
  const server = http.createServer(app);
  const io = socketIO(server);

  io.on('connection', socketFunction(io));

  // app.use('/public', express.static());
  app.get('/ping', (req, res) => res.send('pong'));

  return [server, server.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}`))];
}

module.exports = start;
