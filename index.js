// const express = require('express');
// const path = require('path');

// const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
// const bodyParser = require('body-parser');
// const { saveMessageInDB, getPreviousMessages } = require('./models/model');
// const { formatDate } = require('./services/services');

// const PUBLIC_PATH = path.join(__dirname, 'public');
// app.use(bodyParser.json());
// app.use('/', express.static(PUBLIC_PATH, { extensions: ['html', 'css'] }));

// let usersArr = [];

// io.on('connection', async (socket) => {
//   const previousMessages = await getPreviousMessages();
//   const formatedPreviousMessages = previousMessages
//     .
// map(({ chatMessage, nickname, date }) => ({ chatMessage, nickname, date: formatDate(date) }));

//   socket.emit('previousMessages', formatedPreviousMessages);

//   socket.on('newUser', ({ nickname }) => {
//     usersArr.push({ socketId: socket.id, nickname });
//     const users = usersArr.map(({ nickname: name }) => name);
//     io.emit('listOfUsers', users);
//   });

//   socket.on('nameChanged', ({ nickname }) => {
//     usersArr.push({ socketId: socket.id, nickname });
//     // const { nickname: nick } = usersArr.filter(({ socketId }) => socketId === socket.id)[0];
//     // usersArr = usersArr.filter((e) => e.nickname !== nick);
//     // const index = usersArr.findIndex(({ socketId }) => socketId === socket.id);
//     // console.log(index)
//     // console.log(usersArr[index])
//     // usersArr[index].nickname = nickname;
//     const users = usersArr.map(({ nickname: name }) => name);
//     io.emit('listOfUsers', users);
//   });

//   socket.on('disconnect', () => {
//     usersArr = usersArr.filter(({ socketId }) => socketId !== socket.id);
//     const users = usersArr.map(({ nickname: name }) => name);
//     io.emit('listOfUsers', users);
//   });

//   socket.on('message', async ({ chatMessage, nickname }) => {
//     const { chatMessage: message, nickname: nick, date } = await
//     saveMessageInDB({ chatMessage, nickname });
//     const newDate = formatDate(date);
//     io.emit('message', `${newDate} : ${nick} - ${message}`);
//   });
// });

// http.listen(3000, () => console.log('ouvindo a porta 3000'));
