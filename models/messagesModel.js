const connect = require('./connection');

const save = async ({ message }) => {
  try {
    const db = await connect();
    const insertMessage = await db
      .collection('messages')
      .insertOne({ message });

    return insertMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchMessages = async () => {
  try {
    const db = await connect();
    const messages = await db.collection('messages').find({}).toArray();

    return messages;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  save,
  searchMessages,
};
