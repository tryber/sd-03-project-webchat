const connection = require('./connection');

const listAll = async () => {
  const db = await connection();

  const recipes = await db.collection('messages').find({}).toArray();

  return recipes;
};

const add = async (message) => {
  const db = await connection();

  await db.collection('messages').insertOne({ message });

  return { message };
};

module.exports = {
  listAll,
  add,
};
