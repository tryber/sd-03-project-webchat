const crypto = require('crypto');

const generateRandom = () => `USER-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

const removeFromList = (namesList, id) => namesList.filter((e) => e.id !== id);

const insertIntoList = (nickname, socket, id, namesList) => {
  namesList.push({ nickname, id });
  socket.emit('newUserMsg', nickname);
  socket.emit('listsync', namesList);
};

const swapFromList = ({ oldname, nickname, userlist }, id) => {
  const updatedList = userlist.filter((e) => e.nickname !== oldname);
  updatedList.push({ nickname, id });
  return updatedList;
};

module.exports = {
  generateRandom,
  removeFromList,
  insertIntoList,
  swapFromList,
};
