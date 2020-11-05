const messageWithDate = (nickname, chatMessage) => {
  const newDate = `${new Date().getUTCDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
  const date = new Date().toLocaleTimeString('pt-BR');

  return { string: `(${date} ${newDate}) ${nickname}: ${chatMessage}`, date };
};
const users = [];

const emitHistory = async (messageModel, socket) => {
  const messages = await messageModel.getGeneral();
  console.log(users)

  const history = messages.map(
    ({ chatMessage, nickname, date }) => `(${date}) ${nickname}: ${chatMessage}`,
  );

  socket.emit('history', history);
};
module.exports = (io, messageModel) => {
  io.on('connection', async (socket) => {
    await emitHistory(messageModel, socket);

    socket.on('privateHistory', async (nickname) => {
      const user1 = users.find((u) => u.id === socket.id);
      const index1 = users.indexOf(user1);
      const user2 = users.find((u) => u.nickname === nickname);
      const index2 = users.indexOf(user2);

      const usersArray = [users[index1], users[index2]];

      const messages = await messageModel.getPrivate(usersArray);
      socket.emit('sendPrivateHistory', messages);
    });
    socket.on('private', async ({ nickname, message }) => {
      const user1 = users.find((u) => u.id === socket.id);
      const index1 = users.indexOf(user1);
      const user2 = users.find((u) => u.nickname === nickname);
      const index2 = users.indexOf(user2);
      console.log('pv', user2, message);
      console.log('users', users);
      const usersArray = [users[index1], users[index2]];
      const chatMessage = messageWithDate(nickname, message);
      await messageModel.insertPrivate({ chatMessage, users: usersArray });
      io.clients[user2.socket.id].emit('private', chatMessage);
    });

    socket.on('userConn', (nickname) => {
      // console.log('users before', users);

      users.push({ nickname, id: socket.id });
      // console.log('users on conn:', users);
      io.emit('usersOnline', users);
    });

    socket.on('userChangeName', (nickname) => {
      const user = users.find((u) => u.id === socket.id);
      const index = users.indexOf(user);
      users.splice(index, 1, { nickname, id: socket.id });
      io.emit('usersOnline', users);
    });

    socket.on('disconnecting', () => {
      // on user disconnect pass socket.id
      // console.log(socket.id);
      // console.log('users on disconnecting:', users);

      const user = users.find((u) => u.id === socket.id);
      // console.log('disconnecting user:', user);
      // io.emit('menssage', `${socket.id} saiu`);

      const index = users.indexOf(user);
      users.splice(index, 1);
      // console.log('users on disc', users);
      io.emit('usersOnline', users);
    });

    socket.on('message', async ({ chatMessage, nickname }) => {
      const { string, date } = messageWithDate(nickname, chatMessage);
      await messageModel.insertGeneral({ chatMessage, nickname, date });
      io.emit('message', string);
    });
  });

  return {
    io,
  };
};
