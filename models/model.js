const connection = require('./connection');

const saveMessageInDB = async ({ chatMessage, nickname }) => connection()
  .then((db) => db.collection('messages').insertOne({ chatMessage, nickname, date: new Date() }))
  .then((result) => {
    const { chatMessage: message, nickname: nick, date } = result.ops[0];
    return { chatMessage: message, nickname: nick, date };
  });

const getPreviousMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .then((result) => result
    .map(({ chatMessage, nickname, date }) => ({ chatMessage, nickname, date })));

// const returnLastMessage = () => connection()
//   .then((db) => db.collection('messages').findOne());

module.exports = { saveMessageInDB, getPreviousMessages };
