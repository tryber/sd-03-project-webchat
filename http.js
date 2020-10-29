// const path = require('path');
// const express = require('express');

// // const notificationController = require('./controllers/notificationController');

// const app = express();

// module.exports = (ioServer) => {
//   try {
//     app.get('/', (req, res) => {
//       res.sendFile(path.join(__dirname, 'index.html'));
//     });

//     // io.on('connection', (socket) => {
//     //   console.log(
//     //     'Conectado',
//     //   // JSON.stringify(socket),
//     //   );
//     //   socket.on('disconnect', () => {
//     //     console.log('Desconectado');
//     //   });

//     //   socket.on('mensagem', (msg) => {
//     //     io.emit('mensagemServer', msg);
//     //   });
//     // });
//     // app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));
//     // app.post('/', notificationController.sendNotification(io));

//     return app;
//   } catch (error) {
//     console.log(error);
//   }
// };

/* const randomName = fetch('https://randomuser.me/api/').then(async (data) => {
  const json = await data.json();
  const {
    results: [
      {
        name: { title, first, last },
      },
    ],
  } = await json;
  const name = await `${title} ${first} ${last}`;
  nickname = name;
  nicknameElement.value = nickname;
  socket.emit('userChangeName', nickname)
}); */
