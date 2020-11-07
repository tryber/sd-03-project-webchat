const connection = require('./connect');

const saveUser = async (nickname) =>
  connection().then((db) =>
    db
      .getTable('users')
      .insert(['nickname'])
      .values(nickname)
      .execute());

const editUser = async (nickname) =>
  connection().then((db) =>
    db
      .getTable('users')
      .update()
      .set('nickname', nickname)
      .execute());
module.exports = { editUser, saveUser };
