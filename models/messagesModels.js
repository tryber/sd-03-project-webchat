const connection = require('../tests/helpers/db');

const saveMessageOnDb = async (messageObj, room) => {
  const db = await connection();
  const saveMessage = await db.collection('messages').findOneAndUpdate(
    { chatRoom: room },
    {
      $push: { messagesArray: { ...messageObj, sendOn: new Date() } },
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

const createChatRoomAndSaveMessage = async (messageObj, room) => {
  const db = await connection();
  const createdChatRoom = await db.collection('messages').insertOne(
    {
      messagesArray: [{
        ...messageObj,
        sendOn: new Date(),
      }],
      chatRoom: room,
    },
  );

  return createdChatRoom.ops[0];
};

const createPrivateChatRoomAndSaveMessage = async (id1, id2, messageObj) => {
  const db = await connection();
  const savedMessage = await db.collection('messages').insertOne({
    id1,
    id2,
    messagesArray: [{ ...messageObj, sendOn: new Date() }],
  });
  return savedMessage;
};

const getPrivateMessages = async (id2, id1) => {
  console.log(id1, id2);
  const db = await connection();
  const privateMessages = await db.collection('messages').findOne(
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
  return privateMessages;
};

const savePrivateMessage = async (id1, id2, messageObj) => {
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
      $push: { messagesArray: { ...messageObj, sendOn: new Date() } },
    },
  );
  return saveMessage.value;
};

module.exports = {
  saveMessageOnDb,
  getChatRoomByNumber,
  createChatRoomAndSaveMessage,
  getPrivateMessages,
  savePrivateMessage,
  createPrivateChatRoomAndSaveMessage,
};
