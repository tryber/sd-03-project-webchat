const crypto = require('crypto');

const generateUser = () => `Anonymous-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

module.exports = {
  generateUser,
};
