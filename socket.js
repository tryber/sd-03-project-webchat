// const http = require('http');

// const socketIo = require('socket.io');

// const { getAllMessages } = require('./services/messageServices');
// const messageController = require('./controllers/messageController');

// module.exports = () => {
//   const httpServer = http.createServer();
//   const io = socketIo(httpServer);

//   io.on('connection', async (socket) => {
//     // socket.emit('connect');
//     socket.on('message', (data) => messageController.sendMessage(io, data));
//     socket.emit('history', await getAllMessages());
//   });

//   return {
//     ioServer: httpServer,
//     io,
//   };
// };
