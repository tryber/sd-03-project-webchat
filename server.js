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

  const userId = socket.id;

  const refreshUserList = () => setTimeout(async (
  ) => {
    const users = await getUsers();
    io.emit('userList', { users });
  }, 0);

  const retrieveMessagesFrom = async (
    id) => getHistory().then(((history) => io.to(id).emit('history', { history })));

  const getRecipientNickname = async (idRecipient) => {
    const data = await getUsers({ userId: idRecipient });
    const { nickname: nick } = data[0] || data;
    return nick;
  };

  const warnOneAbout = (one, event, data) => {
    // interesting log
    console.log(`event recipient: ${one}, event: ${event}, data: ${data}`);
    return io.to(one).emit(event, data);
  };

  // const clearThisChat = (id) => io.to(id).emit('clearChat');

  await retrieveMessagesFrom(userId);

  socket.on('registerNick', async (
    { nickname }) => updateUser(userId, nickname).then(() => refreshUserList()));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const data = await registerMessage(chatMessage, nickname);
    const { timestamp } = data.ops[0];
    const message = `${timestamp} - ${nickname} diz: ${chatMessage}`;
    io.emit('message', message);
  });

  socket.on('triggerPrivateChat', async ({ from, to }) => {
    const data = await getUsers({ nickname: to });
    const { userId: recipientId } = data[0] || data;

    const current = await getUsers({ nickname: from });
    const { userId: fromId } = current[0] || current;

    const messageFromSender = await getSecretHistory(fromId, recipientId);
    const messageFromRecipient = await getSecretHistory(recipientId, fromId);
    let secretHistory = messageFromSender.concat(messageFromRecipient);
    secretHistory = secretHistory
      .sort(({ timestamp: timeA }, { timestamp: timeB }) => timeA > timeB)
      .map(({ message }) => message);
    // console.log(secretHistory);
    // clearThisChat(recipientId);

    warnOneAbout(fromId, 'allowPrivateMode', { recipientId });
    warnOneAbout(fromId, 'retrieveSecretHistory', { secretHistory });
  });

  socket.on('privateMessage', async ({ recipientId, chatMessage, nickname }) => {
    const recipientNick = await getRecipientNickname(recipientId);
    const timestamp = new Date(Date.now()).toLocaleString('en-US').replace(/\//g, '-');
    const message = `${timestamp} - ${nickname} diz reservadamente para ${recipientNick}: ${chatMessage}`;

    await registerPrivateMessage(
      userId, recipientId, nickname, recipientNick, chatMessage, timestamp,
    );

    [recipientId, userId].forEach(
      (c) => {
        warnOneAbout(c, 'newPrivateMessage', message);
      },
    );
  });

  socket.on('triggerPublicChat', async ({ _recipientId }) => {
    // [recipientId, userId].forEach(
    //   (c) => {
    //     retrieveMessagesFrom(c);
    //     warnOneAbout(c, 'clearChat');
    //     warnOneAbout(c, 'allowPublicMode');
    //   },
    // );
    retrieveMessagesFrom(userId);
    warnOneAbout(userId, 'clearChat');
    warnOneAbout(userId, 'allowPublicMode');
  });

  socket.on('disconnect', async () => removeUser(userId).then(async () => refreshUserList()));
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
