const user = async (db, sockectId, { chatMessage, nickname }, users, socket) => {
  try {
    if (nickname === undefined) return;
    await db.collection('messages').updateMany(
      { sockectId },
      {
        $set: { chatMessage, nickname },
      },
    );
    const chatMessages = await db.collection('messages').find({}).toArray();
    const maped = users.map((el) => {
      if (el.id === sockectId) {
        return { id: sockectId, nickname };
      }
      return el;
    });
    users.splice(0, chatMessages.length);
    users.push(...maped);
    socket.broadcast.emit('history', chatMessages, users);
    return socket.emit('history', chatMessages, users);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const handleNewName = (db, socket, users) => (newNickName) =>
  user(db, socket.id, newNickName, users, socket);

const handleNotificationEvent = (db, socket, io) =>
  async ({ chatMessage, nickname }) => {
    const { id: sockectId } = socket;
    await db.collection('messages').insertOne({ chatMessage, sockectId, nickname, time: new Date() });
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}
      ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    const message = `${nickname}: ${chatMessage} ${formattedDate}`;
    return io.emit('message', message);
  };

const handleOnline = (socket, users = [], io) => async () => {
  try {
    users.push({ id: socket.id, nickname: socket.id });
    return io.emit('online', users);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const handleDisconnect = (socket, users = [], io) => async () => {
  try {
    const onlines = users.filter((el) => el.id !== socket.id);
    users.splice(0, users.length);
    users.push(...onlines);
    return io.emit('online', users);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = {
  handleNewName,
  handleNotificationEvent,
  handleOnline,
  handleDisconnect,
};
