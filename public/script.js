const socket = io('http://localhost:3000');
const enviar = document.getElementById('enviar');
const caixaDeMensagens = document.getElementById('caixa-mensagens');
const inputMsg = document.getElementById('mensagens');


/* socket.on('message', (data) => {
  const li = document.createElement('li')
  li.textContent = data
  document.getElementById('message').appendChild(li);
}); */

enviar.addEventListener('click', (e) => {
  e.preventDefault();
      const chatMessage = inputMsg.value;
  socket.emit('sendMessage', chatMessage)
});

/* id:="caixa-mensagens"
id="nome"
id ="salvarNome"
id="mensagens"
id="enviar"
 */
