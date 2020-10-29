const httpFactory = require('./http');
const socketFactory = require('./socket');

const { ioServer, io } = socketFactory();
const http = httpFactory(io);

http.listen(3001, () => { console.log('HTTP listening on 3001'); });
ioServer.listen(3000, () => { console.log('Socket.io listening on 3000'); });
