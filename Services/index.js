const Messages = require('./messages');

module.exports = (models) => ({
  Messages: new Messages(models),
});
