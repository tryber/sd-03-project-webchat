const socket = io('http://localhost:3000');

const sendButton = document.getElementById('send-button');
const messageBox = document.getElementById('message-box');
const nicknameSave = document.getElementById('nickname-save');
const nicknameBox = document.getElementById('nickname-box');
const userNickname = document.getElementById('nickname');

const joinedChat = ({ nickname }) => {
  const li = document.createElement('li');

  userNickname.textContent = nickname;

  li.textContent = `${nickname} entrou no chat`;
  li.classList = 'joined message';

  document.getElementById('ul-messages').appendChild(li);
};

// const sendMessage = (event) => {
//   event.preventDefault();

//   const message = messageBox.value;
//   const nickname = userNickname.value;
//   const date = Date.now();

//   socket.emit('message', { message, nickname, date });
// };

const receivedMessage = ({ message }) => {
  console.log('oii');
  const li = document.createElement('li');

  li.textContent = message;
  li.setAttribute('data-testid', 'message');
  li.classList = 'message';

  document.getElementById('ul-messages').appendChild(li);
};

sendButton.addEventListener('click', (e) => {
  e.preventDefault();

  const message = messageBox.value;
  const nickname = userNickname.innerText;
  const date = Date.now();

  socket.emit('message', { message, nickname, date });
});

socket.on('connect', () => {
  console.log('connect');
});

socket.on('joined', (data) => joinedChat(data));

socket.on('message', (data) => receivedMessage(data));
