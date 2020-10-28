// o codigo deste projeto foi baseado no codigo da aula ao vivo presente neste pull request:
// https://github.com/tryber/sd-03-live-lectures/tree/socket-io

const httpFactory = require('./http');
const socketFactory = require('./socket');

const { ioServer, io } = socketFactory();
const http = httpFactory(io);

http.listen(3000, () => { console.log('HTTP listening on 3000'); });
ioServer.listen(4555, () => { console.log('Socket.io listening on 4555'); });
