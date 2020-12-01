// const caixaDeTexto = document.getElementById('caixa-de-texto');
// const nicknameBox = document.getElementById('nickname-box');
// const io = require('socket.io-client');

// console.log(io);

// let username = `user#${Math.round(Math.random() * 123)}`;
// nicknameBox.value = username;

// const socket = io();
// let room = 'all';
// const messagesArray = [];

// function sendMessage(roomToSend = 'all') {
//   const chatMessage = caixaDeTexto.value;

//   if (chatMessage.length > 0) {
//     if (roomToSend !== 'all') {
//       socket.emit('private', roomToSend, { nickname: username, chatMessage });
//     } else {
//       socket.emit('message', { nickname: username, chatMessage });
//     }
//   }
//   console.log(messagesArray);
//   caixaDeTexto.value = '';
//   return undefined;
// }

// function cleanUpUsers() {
//   const usersList = document.getElementById('usersOn');
//   usersList.innerHTML = '';
// }

// function changeNickname() {
//   username = nicknameBox.value;
//   socket.emit('change-nick', username);
// }

// function createMessage(msg) {
//   const li = document.createElement('li');
//   li.classList.add('message');
//   li.setAttribute('data-testid', 'message');
//   li.appendChild(document.createTextNode(msg));
//   return li;
// }

// function renderMessage(msg, id = ['all']) {
//   if (id.includes(room)) {
//     const ul = document.getElementById('mensagens');
//     const message = createMessage(msg);
//     ul.appendChild(message);
//     ul.scrollTop = ul.scrollHeight;
//   }
// }

// function changeRoom(roomToConnect) {
//   const ul = document.getElementById('mensagens');
//   ul.innerHTML = '';
//   room = roomToConnect;
//   console.log(messagesArray);
//   messagesArray.forEach(({ message, room: roomToRender }) => {
//     renderMessage(message, roomToRender);
//   });
// }

// function showONUser({ user: nickname, socket: socketToChange }) {
//   const usersList = document.getElementById('usersOn');
//   const li = document.createElement('li');

//   const button = document.createElement('button');
//   button.setAttribute('data-testid', 'private');
//   button.innerText = 'priv';
//   button.addEventListener('click', () => changeRoom(socketToChange));

//   li.setAttribute('data-testid', 'online-user');
//   if (nickname !== username) {
//     li.appendChild(button);
//   }
//   li.appendChild(document.createTextNode(nickname));
//   usersList.appendChild(li);
//   usersList.scrollTop = usersList.scrollHeight;
// }

// document.getElementById('send-button').addEventListener('click', () => sendMessage(room));
// document.getElementById('all-rooms').addEventListener('click', () => changeRoom('all'));
// document.getElementById('nickname-save').addEventListener('click', changeNickname);

// socket.on('connect', () => {
//   socket.emit('userOn', nicknameBox.value);
// });

// socket.on('disconnect', () => {
//   socket.emit('userOff', nicknameBox.value);
// });

// socket.on('userList', (users) => {
//   cleanUpUsers();
//   users.forEach((user) => {
//     showONUser(user);
//   });
// });

// socket.on('message', (message, senderId) => {
//   let messageToSave;
//   console.log('senderId', senderId);
//   const id = senderId || ['all'];
//   if (id) {
//     messageToSave = { message, room: senderId };
//   } else {
//     messageToSave = { message };
//   }
//   messagesArray.push(messageToSave);
//   console.log(messagesArray);
//   renderMessage(message, senderId);
// });

// socket.on('history', (messages) => {
//   messages.forEach((message) => {
//     const messageToSave = { message };
//     messagesArray.push(messageToSave);
//     renderMessage(message);
//   });
// });
