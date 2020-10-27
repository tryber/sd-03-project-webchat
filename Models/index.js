const { connectTo } = require('./connection');
const Messages = require('./message');
const Users = require('./users');

module.exports = (config) => ({
  Messages: new Messages({ connectTo, config }),
  Users: new Users({ connectTo, config }),
});
