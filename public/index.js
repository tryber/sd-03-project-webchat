const socket = io('http://localhost:3000');
const sendButton = document.getElementById('send-button');
let nickname = '';
let room = 'public';

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  let message = document.getElementById('message').value;
  const messageObj = {
    chatMessage: message,
    nickname,
      room,
  };
  socket.emit('message', messageObj);
  message = '';
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.textContent = message;
  li.setAttribute('data-testid', 'message');
  document.getElementById('messages').appendChild(li);
};

const publicElement = document.getElementById('public');

publicElement.addEventListener('click', () => {
  socket.emit('getHistory', room);
  room = 'public';
});

const nicknameSave = document.getElementById('nickname-save');
const nicknameBox = document.getElementById('nickname-box');

nicknameSave.addEventListener('click', () => {
  socket.emit('changeNickname', nicknameBox.value);
});

socket.on('history', (messages) => {
  document.getElementById('messages').innerHTML = '';
  messages.forEach((message) => {
		const [nick, chatMessage, sentOnDate, sentOnTime, messageRoom] = message.split(',');
		console.log(messageRoom);
    createMessage(`${nick}: ${chatMessage} - ${sentOnDate} ${sentOnTime}`);
  });
});

socket.on('message', (message) => {
  const [nick, chatMessage, sentOnDate, sentOnTime, messageRoom] = message.split(', ');
  if (messageRoom === room) {
    createMessage(`${nick}: ${chatMessage} - ${sentOnDate} ${sentOnTime}`);
  }
});

socket.on('getOnlineUsers', (onlineUsers) => {
  document.getElementById('usersList').innerHTML = '';
  const myUser = onlineUsers.find((user) => user.id === socket.id);
  nickname = myUser.nickname;
  onlineUsers.forEach((onlineUser) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList = 'list-group-item list-group-item-action bg-light';
    button.setAttribute('data-testid', 'private');
    const span = document.createElement('span');
    span.setAttribute('data-testid', 'online-user');
    button.appendChild(span);
    span.textContent = onlineUser.nickname;
    if (onlineUser.nickname === nickname) {
      button.disabled = true;
      button.setAttribute('data-testid', 'none');
    }
    button.addEventListener('click', () => {
      const friendId = onlineUser.id.split('').reduce((acc, word) => acc + parseInt(word.charCodeAt(0), 10), 0);
      const myId = myUser.id.split('').reduce((acc, word) => acc + parseInt(word.charCodeAt(0), 10), 0);
      room = friendId + myId;
      socket.emit('changeChat', room);
    });
    document.getElementById('usersList').appendChild(button);
  });
});
