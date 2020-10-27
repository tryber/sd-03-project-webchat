const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
// const bodyParser = require('body-parser');

function start({ PORT = 3000, PUBLIC_PATH = 'Public' }, socketFunction) {
  const app = express();
  // app.use(bodyParser.json());
  const server = http.createServer(app);
  const io = socketIO(server);

  io.on('connection', socketFunction(io));
  app.use('/', express.static(path.join(__dirname, PUBLIC_PATH), { extensions: ['html'] }));
  app.get('/ping', (req, res) => res.send('pong'));

  return [server, server.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}`))];
}

module.exports = start;
