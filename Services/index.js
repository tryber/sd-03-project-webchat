const Messages = require('./messages');
const Users = require('./users');

module.exports = (models) => ({
  Messages: new Messages(models),
  Users: new Users(models),
});
