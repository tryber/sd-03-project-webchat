/* eslint-disable arrow-parens */
const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { updateUser, removeUser, getUsers, deleteUsers } = require('./model/userModel');
const { registerMessage, getHistory, deleteMessages, registerPrivateMessage, getSecretHistory } = require('./model/messageModel');

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

  const retrieveMessagesFrom = async (id) => getHistory().then(((history) => io.to(id).emit('history', { history })));

  await retrieveMessagesFrom(userId);

  socket.on('registerNick', async ({ nickname }) => updateUser(userId, nickname).then(() => refreshUserList()));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const data = await registerMessage(chatMessage, nickname);
    const { timestamp } = data.ops[0];
    const message = `${timestamp} - ${nickname} diz: ${chatMessage}`;
    io.emit('message', message);
  });

  const getRecipientNickname = async (idRecipient) => {
    const data = await getUsers({ userId: idRecipient });
    const { nickname: nick } = data[0];
    return nick;
  };

  const warnOneAbout = (one, event, data) => io.to(one).emit(event, { data });

  socket.on('triggerPrivateChat', async ({ to }) => {
    const data = await getUsers({ nickname: to });
    const { userId: privateUserId } = data[0];

    const { nick: from } = await getRecipientNickname(userId);
    const secretHistory = await getSecretHistory(from, to);
    console.log(secretHistory);

    io.to(privateUserId).emit('clearChat');

    [privateUserId, userId].forEach((c, i) => {
      warnOneAbout(c, 'retrieveSecretHitory', { secretHistory });
      warnOneAbout(c, 'allowPrivateMode', { privateUserId });
      return i === 0 && warnOneAbout(c, 'allowPrivateMode', { privateUserId: userId });
    });
  });

  socket.on('privateMessage', async ({ privateRecipient, chatMessage, nickname }) => {
    const recipientNick = await getRecipientNickname(privateRecipient);
    const data = await registerPrivateMessage(nickname, recipientNick, chatMessage);
    const { timestamp } = data.ops[0];
    const message = `${timestamp} - ${nickname} diz reservadamente para ${recipientNick}: ${chatMessage}`;
    io.to(privateRecipient).emit('message', message);
    io.to(userId).emit('message', message);
  });

  socket.on('triggerPublicChat', async ({ recipientId }) => {
    [recipientId, userId].forEach(c => {
      retrieveMessagesFrom(c);
      warnOneAbout('clearChat', c);
      warnOneAbout('allowPublicMode', c);
    });
  });

  socket.on('disconnect', async () => removeUser(userId).then(async () => refreshUserList()));
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
