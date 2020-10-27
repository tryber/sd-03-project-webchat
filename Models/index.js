const { connectTo } = require('./connection');
const Messages = require('./message');

module.exports = (config) => ({
  Messages: new Messages({ connectTo, config }),
});
