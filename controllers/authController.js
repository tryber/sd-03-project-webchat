const crypto = require('crypto');

const login = (socket) => ({ username, password }) => {
  if (username !== 'admin' || password !== '1234') {
    return socket.emit('loginFailed', { message: 'Incorrect credentials' });
  }

  socket.emit('token', { token: crypto.randomBytes(8).toString('hex') });
};

module.exports = {
  login,
};
