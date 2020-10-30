const httpFactory = require('./http');
const socketFactory = require('./socket');
const connection = require('./tests/helpers/db');

const { ioServer, io } = socketFactory(connection);
const http = httpFactory(io);

http.listen(3000, () => { console.log('HTTP listening on 3000'); });
ioServer.listen(4555, () => { console.log('Socket.io listening on 4555'); });
