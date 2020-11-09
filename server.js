const { pathToFileURL } = require('url');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path')
const { getAllmessages, saveMessage } = require('./models/messageModels')

let arrUsers = [];

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', async (socket) => {
  const savedMessages = await getAllmessages();
  socket.emit('history', savedMessages);
  const id = arrUsers.length + 1;


  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const msgDate = date.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const msgTime = date.toLocaleTimeString('pt-BR');
    await saveMessage(msgTime, msgDate, chatMessage, nickname);
    io.emit('message', `${msgDate} ${msgTime} - ${nickname}: ${chatMessage}`);
  });

  socket.on('newUser', (nickname) => {
    arrUsers.push({id, nickname});
    io.emit('onlineList', arrUsers);
    console.log(arrUsers);
  });

  socket.on('changeNick', async (newNick) => {
    // arrUsers = await arrUsers.reduce((acc, elem) => {
    //   if (elem.id !== id) {
    //     return acc.push(elem);
    //   }
    //   return acc.push({ id: elem.id, newNick });
    // }, []);
    const index = arrUsers.findIndex((elem) => elem.id === id);
    if (arrUsers[index]) arrUsers[index].nickname = newNick;
    io.emit('onlineList', arrUsers);
  });

  socket.on('disconnect', () => {
    arrUsers = arrUsers.filter((elem) => elem.id !== id);
    io.emit('onlineList', arrUsers);
  });

});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
