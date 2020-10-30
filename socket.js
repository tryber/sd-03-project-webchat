const emitHistory = async (messageModel, socket) => {
  const messages = await messageModel.getGeneral();

  const history = messages.map(
    ({ chatMessage, nickname, date }) => `(${date}) ${nickname}: ${chatMessage}`,
  );

  socket.emit('history', history);
};
const users = [];
module.exports = (io, messageModel) => {
  io.on('connection', async (socket) => {
    await emitHistory(messageModel, socket);

    socket.on('userConn', (nickname) => {
      console.log('users before', users);

      users.push({ nickname, id: socket.id });
      console.log('users on conn:', users);
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
      console.log('users on disconnecting:', users);

      const user = users.find((u) => u.id === socket.id);
      console.log('disconnecting user:', user);
      io.emit('mensagemServer', `${socket.id} saiu`);
      const index = users.indexOf(user);

      users.splice(index, 1);

      console.log('users on disc', users);
      io.emit('usersOnline', users);
    });

    socket.on('message', async ({ chatMessage, nickname }) => {
      const newDate = `${new Date().getUTCDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
      const date = new Date().toLocaleTimeString('pt-BR');

      await messageModel.insertGeneral({ chatMessage, nickname, date });
      io.emit('message', `(${date} ${newDate}) ${nickname}: ${chatMessage}`);
    });
  });

  return {
    io,
  };
};
