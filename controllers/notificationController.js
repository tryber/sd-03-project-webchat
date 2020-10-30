const user = (chatMessages, id, newNickName, users, socket) => {
  if (newNickName === id || newNickName === undefined) return;
  const thisUser = users.filter((el) => el.id === id);
  if (thisUser[0] === undefined) return;
  const notThisUser = users.filter((el) => el.id !== id);
  const xablau = chatMessages
    .map(({ chatMessage, nickname }) => {
      if (thisUser[0].nickname === nickname) {
        users.splice(0, chatMessages.length);
        users.push(...notThisUser, { id, nickname: newNickName });
        return { chatMessage, nickname: newNickName };
      }
      return { chatMessage, nickname };
    });
  chatMessages.splice(0, chatMessages.length);
  chatMessages.push(...xablau);
  socket.broadcast.emit('history', chatMessages, users);
  return socket.emit('history', chatMessages, users);
};

const handleNewName = (chatMessages, socket, users) => (newNickName) =>
  user(chatMessages, socket.id, newNickName, users, socket);

const handleNotificationEvent = (ChatMessages, socket, users) =>
  (chatMessage, nickname) => {
    const { id } = socket;
    const thisUser = users.find((el) => el.id === id);
    if (thisUser === undefined) {
      users.push({ id, nickname: id });
      ChatMessages.push({ chatMessage, nickname: id });
      user(ChatMessages, id, nickname, users, socket);
      socket.emit('newMessage', { chatMessage, nickname: id });
      return socket.broadcast.emit('newMessage', { chatMessage, nickname: id });
    }
    users.push({ id, nickname: thisUser.nickname });
    ChatMessages.push({ chatMessage, nickname: thisUser.nickname });
    user(ChatMessages, thisUser.id, nickname, users, socket);
    socket.emit('newMessage', { chatMessage, nickname: thisUser.id });
    return socket.broadcast.emit('newMessage', { chatMessage, nickname: thisUser.id });
  };

module.exports = {
  handleNewName,
  handleNotificationEvent,
};
