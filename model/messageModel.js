const connection = require('./connection');

const registerMessage = async (chatMessage, nickname) => {
  const db = await connection();
  const timestamp = new Date(Date.now()).toLocaleString('en-US').replace(/\//g, '-');
  return db.collection('messages').insertOne(
    {
      chatMessage, nickname, timestamp,
    },
  )
    .catch(({ status, errMessage }) => {
      throw new Error(`${status} - ${errMessage}`);
    });
};

const getHistory = async () => {
  const db = await connection();
  const history = await db.collection('messages').find().toArray()
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
  const messageHistory = history !== [] ? history
    .map(({ chatMessage, nickname, timestamp }) => `${timestamp} - ${nickname} diz: ${chatMessage}`) : [];
  return messageHistory;
};

const deleteMessages = async (messageId = {}) => {
  const db = await connection();
  return db.collection('messages').deleteMany(messageId)
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

const registerPrivateMessage = async (from, to, fromNick, toNick, chatMessage, timestamp) => {
  const db = await connection();
  return db.collection('reservedMessages').insertOne(
    {
      chatMessage, from, fromNick, to, toNick, timestamp,
    },
  )
    .catch(({ status, errMessage }) => {
      throw new Error(`${status} - ${errMessage}`);
    });
};

const getSecretHistory = async (from, to) => {
  const db = await connection();
  const history = await db.collection('reservedMessages')
    .find({ $and: [{ from }, { to }] }).toArray()
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
  const secretHistory = history !== [] ? history
    .map(({ chatMessage, timestamp, fromNick, toNick }) =>
      `${timestamp} - ${fromNick} diz reservadamente para ${toNick}: ${chatMessage}`)
    : [];
  return secretHistory;
};

module.exports = {
  getSecretHistory,
  getHistory,
  registerMessage,
  deleteMessages,
  registerPrivateMessage,
};
