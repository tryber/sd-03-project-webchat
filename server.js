const { pathToFileURL } = require('url');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path')

app.get('/', (req, res) => {
 
  res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', async (socket) => {
  console.log(
    'Usuário conectado, igual ao que fizemos na aula anterior, porém dessa vez em um servidor escalável'
  );
  socket.on('message', ({ chatMessage, nickname }) => {
    const date = new Date();
    const msgDate = date.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const msgTime = date.toLocaleTimeString('pt-BR');
    io.emit(`${msgDate} ${msgTime} - ${nickname}: ${chatMessage}`);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
