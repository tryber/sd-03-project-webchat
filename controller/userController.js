const crypto = require('crypto');

const generateUser = (socket) => {
  const newUserName = `Anonymous-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  socket.broadcast.emit('newUserMsg', newUserName);
};

const removeFromList = (namesList, name) => namesList.filter((e) => e !== name);

const insertIntoList = (namesList, name) => {
  namesList.push(name);
};

const swapUserFromList = ({ oldname, username, userlist }) => {
  const updatedList = userlist.filter((e) => e !== oldname);
  updatedList.push(username);
  return updatedList;
};

module.exports = {
  generateUser,
  removeFromList,
  insertIntoList,
  swapUserFromList,
};
