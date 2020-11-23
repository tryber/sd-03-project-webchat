const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { updateUser, removeUser, getUsers, deleteUsers } = require('./model/userModel');
const { registerMessage, getHistory, deleteMessages, registerPrivateMessage } = require('./model/messageModel');

// clears users DB
deleteUsers();
deleteMessages();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', async (socket) => {
  console.log('Conectado');

  const refreshUserList = () => setTimeout(async () => {
    const users = await getUsers();
    io.emit('userList', { users });
  }, 500);

  const userId = socket.id;

  const retrieveMessages = async (id) => getHistory().then(((history) => io.to(id).emit('history', { history })));

  await retrieveMessages(userId);

  socket.on('registerNick', async ({ nickname }) => updateUser(userId, nickname).then(() => refreshUserList()));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const data = await registerMessage(chatMessage, nickname);
    const { timestamp } = data.ops[0];
    const message = `${timestamp} - ${nickname} diz: ${chatMessage}`;
    io.emit('message', message);
  });

  socket.on('triggerPrivateChat', async ({ to }) => {
    const data = await getUsers({ nickname: to });
    const { userId: privateUserId } = data[0];

    io.to(privateUserId).emit('clearChat');
    io.to(privateUserId).emit('allowPrivateMode', { privateUserId: userId });
    io.to(userId).emit('allowPrivateMode', { privateUserId });
  });

  socket.on('privateMessage', async ({ privateRecipient, chatMessage, nickname }) => {
    const getRecipientNickname = async () => {
      const data = await getUsers({ userId: privateRecipient });
      const { nickname: nick } = data[0];
      return nick;
    };

    const recipientNick = await getRecipientNickname();
    const data = await registerPrivateMessage(nickname, recipientNick, chatMessage);
    const { timestamp } = data.ops[0];
    const message = `${timestamp} - ${nickname} diz reservadamente para ${recipientNick}: ${chatMessage}`;
    io.to(privateRecipient).emit('message', message);
    io.to(userId).emit('message', message);
  });

  socket.on('triggerPublicChat', async ({ recipientId }) => {
    io.to(recipientId).emit('clearChat');
    io.to(userId).emit('clearChat');
    io.to(recipientId).emit('allowPublicMode');
    io.to(userId).emit('allowPublicMode');
    await retrieveMessages(recipientId);
    await retrieveMessages(userId);
  });

  socket.on('disconnect', async () => removeUser(userId).then(async () => refreshUserList()));
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
