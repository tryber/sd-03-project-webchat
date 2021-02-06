const moment = require('moment');
// const connection = require('../services/db');
const connection = require('../tests/helpers/db');

async function saveMessage({ chatMessage, nickname }) {
  const date = moment().format('DD-MM-yyyy HH:mm:ss');
  return connection()
    .then((db) => db.collection('messages')
      .insertOne({ chatMessage, nickname, date }));
}

function formatMessage(message, privated = false) {
  if (privated) {
    return `${moment().format('DD-MM-yyyy HH:mm:ss')}(private) ${message.nickname} ${message.chatMessage}`;
  }
  return `${moment().format('DD-MM-yyyy HH:mm:ss')} ${message.nickname} ${message.chatMessage}`;
}

async function getAllMessages() {
  return connection()
    .then((db) => db.collection('messages')
      .find().toArray());
}
module.exports = { saveMessage, formatMessage, getAllMessages };
