const socket = io('http://localhost:4555');

const sendMessage = () => {
  const message = document.getElementById('message-input').value;
  socket.emit('message', { nickname: 'Katia', message });
};

const createMessage = (data) => {
  const newMessage = document.createElement('p');
  newMessage.setAttribute('data-testid', 'message');
  newMessage.innerText = `${data}`;
  return newMessage;
};

socket.on('history', (history) => history
  .forEach((data) => document.getElementById('all-messages')
    .appendChild(createMessage(data.message))));

socket.on('serverResponse', ({ message }) => {
  document.getElementById('all-messages')
    .appendChild(createMessage(message));
});

document.getElementById('send-button')
  .addEventListener('click', () => sendMessage());
