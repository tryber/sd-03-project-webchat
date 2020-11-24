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
    io.emit('message', { message });
  });

  const getRecipientNickname = async (idRecipient) => {
    const data = await getUsers({ userId: idRecipient });
    const { nickname: nick } = data[0] || data;
    return nick;
  };

  const warnOneAbout = (one, event, data) => {
    console.log(`event recipient: ${one}, event: ${event}, data: ${data}`);
    return io.to(one).emit(event, data);
  };

  const clearThisChat = (id) => io.to(id).emit('clearChat');

  socket.on('triggerPrivateChat', async ({ _from, to }) => {
    const data = await getUsers({ nickname: to });
    const { userId: recipientId } = data[0] || data;

    const secretHistory = await getSecretHistory(userId, recipientId);

    clearThisChat(recipientId);

    [recipientId, userId].forEach((c, i) => {
      warnOneAbout(c, 'retrieveSecretHistory', { secretHistory });
      if (i === 0) return warnOneAbout(c, 'allowPrivateMode', { recipientId: userId });
      warnOneAbout(c, 'allowPrivateMode', { recipientId });
    });
  });

  socket.on('privateMessage', async ({ recipientId, chatMessage, nickname }) => {
    const recipientNick = await getRecipientNickname(recipientId);
    const timestamp = new Date(Date.now()).toLocaleString('en-US').replace(/\//g, '-');
    const message = `${timestamp} - ${nickname} diz reservadamente para ${recipientNick}: ${chatMessage}`;

    await registerPrivateMessage(
      userId, recipientId, nickname, recipientNick, chatMessage, timestamp,
    );

    [recipientId, userId].forEach((c) => {
      warnOneAbout(c, 'message', { message });
    });
  });

  socket.on('triggerPublicChat', async ({ recipientId }) => {
    [recipientId, userId].forEach(c => {
      retrieveMessagesFrom(c);
      warnOneAbout(c, 'clearChat');
      warnOneAbout(c, 'allowPublicMode');
    });
  });

  socket.on('disconnect', async () => removeUser(userId).then(async () => refreshUserList()));
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
