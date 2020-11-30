const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const {
  getAllmessages, saveMessage, getAllChats, createPrivateChat, getOneChat, savePrivateChat,
} = require('./models/messageModels');

let arrUsers = [];

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

io.on('connection', async (socket) => {
  const savedMessages = await getAllmessages();
  socket.emit('history', savedMessages);
  const id = arrUsers.length + 1;

  socket.on('message', async ({ chatMessage, nickname, privateChat, privateChatId }) => {
    const date = new Date();
    const msgDate = date.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const msgTime = date.toLocaleTimeString('pt-BR');
    const completeMSG = `${msgDate} ${msgTime} - ${nickname}: ${chatMessage}`;
    if (!privateChat) {
      await saveMessage(completeMSG);
      io.emit('message', completeMSG);
    } else {
      const oldPM = await getOneChat(privateChatId);
      const actualPM = oldPM[0].arrMSG || [];
      const newArr = [...actualPM, completeMSG];
      await savePrivateChat(newArr, privateChatId);
      io.to(privateChatId).emit('message', completeMSG);
    }
  });

  socket.on('newUser', async (nickname) => {
    await arrUsers.push({ id, nickname });
    io.emit('onlineList', { arrUsers });
  });

  socket.on('changeNick', async (newNick) => {
    // arrUsers = await arrUsers.reduce((acc, elem) => {
    //   if (elem.id !== id) {
    //     acc = [...acc, elem];
    //     return acc;
    //   }
    //   acc = [...acc, { id: elem.id, newNick }];
    //   return acc;
    // }, []);
    const index = arrUsers.findIndex((elem) => elem.id === id);
    if (arrUsers[index]) arrUsers[index].nickname = newNick;
    io.emit('onlineList', { arrUsers });
  });

  socket.on('EnterPrivate', async ({ user1, user2 }) => {
    const savedPrivateMessages = await getAllChats() || [];
    const firstFilterPM = savedPrivateMessages.filter((elem) => (
      elem.arrUsers[0] === user1 || elem.arrUsers[1] === user1
    )) || [];
    const secondFilterPM = firstFilterPM.filter((elem) => (
      elem.arrUsers[0] === user2 || elem.arrUsers[1] === user2
    )) || [];
    console.log(savedPrivateMessages, 'todos chats');
    console.log(firstFilterPM, 'primeiro filtro');
    console.log(secondFilterPM, 'segundo filtro');
    if (secondFilterPM.length !== 0) {
      const { _id: idChat } = secondFilterPM[0];
      socket.join(idChat);
      io.to(idChat).emit('EnterPM', secondFilterPM[0]);
    } else {
      const newArrUsers = [user1, user2];
      const newChat = await createPrivateChat(newArrUsers);
      const { _id: idChat } = newChat;
      socket.join(idChat);
      io.to(idChat).emit('EnterPM', newChat);
    }
  });

  socket.on('disconnect', () => {
    arrUsers = arrUsers.filter((elem) => elem.id !== id);
    io.emit('onlineList', { arrUsers });
  });

  socket.on('recoverHistory', async (idChat) => {
    socket.leave(idChat);
    const recoverMessages = await getAllmessages();
    socket.emit('history', recoverMessages);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
