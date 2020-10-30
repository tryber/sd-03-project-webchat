const user = (chatMessages, id, newNickName, users) => {
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
  return chatMessages.push(...xablau);
};

const handleNewName = (chatMessages, socket, users) => (newNickName) =>
  user(chatMessages, socket.id, newNickName, users);

const handleNotificationEvent = (ChatMessages, socket, users) =>
  (chatMessage, nickname) => {
    const { id } = socket;
    users.push({ id, nickname: id });
    ChatMessages.push({ chatMessage, nickname: id });
    user(ChatMessages, id, nickname, users);
    socket.emit('newMessage', { chatMessage, nickname: id });
    return socket.broadcast.emit('newMessage', { chatMessage, nickname: id });
  };

module.exports = {
  handleNewName,
  handleNotificationEvent,
};
