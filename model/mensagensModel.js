/* const { ObjectId } = require('mongodb'); */
const connection = require('./connect');

const saveMessage = async (nickname, message) =>
  connection().then((db) =>
    db
      .getTable('message')
      .insert(['nickname', 'message'])
      .values(nickname, message)
      .execute(),
  );


module.exports = { saveMessage };