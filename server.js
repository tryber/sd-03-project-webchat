const { pathToFileURL } = require('url');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path')
const { getAllmessages, saveMessage } = require('./models/messageModels')

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', async (socket) => {
  const savedMessages = await getAllmessages();
  socket.emit('history', savedMessages);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const msgDate = date.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const msgTime = date.toLocaleTimeString('pt-BR');
    await saveMessage(msgTime, msgDate, chatMessage, nickname);
    io.emit('message', `${msgDate} ${msgTime} - ${nickname}: ${chatMessage}`);
  });

});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
