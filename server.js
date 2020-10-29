const socketFactory = require('./socketFactory');
const httpFactory = require('./httpFactory');

const { ioServer, io } = socketFactory();
const http = httpFactory(io);

http.listen(3000, () => console.log('HTTP listening on port 3000'));
ioServer.listen(4555, () => console.log('Socket.io listening on port 4555'));
