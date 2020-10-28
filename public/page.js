const socket = io('http://localhost:4555');

const sendMessage = () => {
  const message = document.getElementById('message-input').value;
  socket.emit('message', { nickname: 'Katia', message });
};

socket.on('serverResponse', ({ nickname, message }) => {
  const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
  const time = Date().split(' ')[4];

  const newMessage = document.createElement('p');
  newMessage.setAttribute('data-testid', 'message');
  newMessage.innerText = `${date}, ${time} - (${nickname}): ${message}`;

  document.getElementById('all-messages')
    .appendChild(newMessage);
});

document.getElementById('send-button')
  .addEventListener('click', () => sendMessage());
