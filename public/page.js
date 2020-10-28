const socket = io('http://localhost:4555');

const sendMessage = () => {
  const message = document.getElementById('message-input').value;
  socket.emit('message', { nickname: 'Katia', message });
};

socket.on('serverResponse', (message) => {
  const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
  const time = Date().split(' ')[4];

  console.log(message);
  console.log(date);
  console.log(time);
});

document.getElementById('send-button')
  .addEventListener('click', () => sendMessage());
