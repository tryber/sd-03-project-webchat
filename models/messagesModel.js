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

module.exports = {
  saveMessageOnDb,
  getChatRoomByNumber,
  createChatRoomAndSaveMessage,
};
