const connection = require('../tests/helpers/db'); //faz o conexao com BD

const saveMsgBase = async (msgObj, room) => {
  const db = await connection();
  const saveMessage = await db.collection('messages').findOneAndUpdate(
    { chatRoom: room },
    {
      $push: { messagesArray: { ...msgObj, sendOn: new Date() } },
    },
  );
  return saveMessage.value;
};

const getChatRoomByNumber = async (room) => {
  const db = await connection();
  const chatRoom = await db.collection('messages').findOne(
    { chatRoom: room },
  );
  return chatRoom;
};

const createChatRoomAndSaveMessage = async (msgObj, room) => {
  const db = await connection();
  const createdChatRoom = await db.collection('messages').insertOne(
    {
      messagesArray: [{
        ...msgObj,
        sendOn: new Date(),
      }],
      chatRoom: room,
    },
  );

  return createdChatRoom.ops[0];
};

const createPrivateChatRoomAndSaveMessage = async (id1, id2, msgObj) => {
  const db = await connection();
  const savedMessage = await db.collection('messages').insertOne({
    id1,
    id2,
    messagesArray: [{ ...msgObj, sendOn: new Date() }],
  });
  return savedMessage;
};

const getPrivateMessages = async (id2, id1) => {
  const db = await connection();
  const privateMessagesDb = await db.collection('messages').findOne(
    {
      $or: [
        {
          $and: [
            { id1 },
            { id2 },
          ],
        },
        {
          $and: [
            { id1: id2 },
            { id2: id1 },
          ],
        },
      ],
    },
  );
  return privateMessagesDb;
};

const savePrivateMessage = async (id1, id2, msgObj) => {
  const db = await connection();
  const saveMessage = await db.collection('messages').findOneAndUpdate(
    {
      $or: [
        {
          $and: [
            { id1 },
            { id2 },
          ],
        },
        {
          $and: [
            { id1: id2 },
            { id2: id1 },
          ],
        },
      ],
    },
    {
      $push: { messagesArray: { ...msgObj, sendOn: new Date() } },
    },
  );
  return saveMessage.value;
};

module.exports = {
  saveMsgBase,
  getChatRoomByNumber,
  createChatRoomAndSaveMessage,
  getPrivateMessages,
  savePrivateMessage,
  createPrivateChatRoomAndSaveMessage,
};
