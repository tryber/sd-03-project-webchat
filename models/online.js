const connection = require('../tests/helpers/db');

const getAll = () =>
  connection()
    .then((db) =>
      db
        .collection('recipes')
        .find({})
        .toArray());

const addUser = (id) =>
  connection().then((db) =>
    db
      .collection('online')
      .insertOne(
        { nickname: id, id },
      ))
    .catch((e) => console.log('addUser', e));

const updateNickname = (id, nickname) => connection()
  .then((db) =>
    db
      .collection('online')
      .updateOne({ id }, { $set: { nickname } }));

const removeUser = (id) =>
  connection()
    .then((db) => db
      .collection('online')
      .deleteOne({ id }))
    .catch((e) => console.log('removeUser', e));

module.exports = { getAll, addUser, updateNickname, removeUser };
