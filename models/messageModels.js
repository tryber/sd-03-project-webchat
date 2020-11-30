const { ObjectId } = require('mongodb');

const connection = require('../tests/helpers/db');

const getAllmessages = async () => (
  connection().then((db) => (db).collection('messages').find({}).toArray())
);

const saveMessage = async (completeMSG) => (
  connection()
    .then((db) => (
      db.collection('messages').insertOne({ completeMSG })))
    .then(() => ({
      completeMSG,
    }))
);

const getAllChats = async () => (
  connection().then((db) => (db).collection('private').find({}).toArray())
);

const createPrivateChat = async (arrUsers, arrMSG = []) => (
  connection()
    .then((db) => (
      db.collection('private').insertOne({ arrMSG, arrUsers })))
    .then(({ insertedId }) => ({
      _id: insertedId,
      arrMSG,
      arrUsers,
    }))
);

const getOneChat = async (id) => (
  connection()
    .then((db) => (
      db.collection('private')
        .find({ _id: ObjectId(id) })).toArray())
);

const savePrivateChat = async (completeArr, id) => (
  connection()
    .then((db) => (
      db.collection('private')
        .updateOne({ _id: ObjectId(id) }, { $set: { arrMSG: completeArr } })))
);

module.exports = {
  getAllmessages,
  saveMessage,
  getAllChats,
  createPrivateChat,
  getOneChat,
  savePrivateChat,
};
