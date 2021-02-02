const connect = require('./connection');

const save = async ({ message, nickname, date }) => {
  try {
    const db = await connect();
    const insertMessage = await db
      .collection('messages')
      .insertOne({ message, nickname, date });
    const { insertedId: _id } = insertMessage;
    return { _id };
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchAllMessages = async () => {
  try {
    const db = await connect();
    const messages = await db.collection('messages').find().toArray();

    return [...messages];
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  save,
  searchAllMessages,
};
