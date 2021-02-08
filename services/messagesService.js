const models = require('../models/messagesModel');

const saveMessage = async (messageObj, room) => {
  const newMessage = await models.saveMessageOnDb(messageObj, room);
  return newMessage;
};

const savePrivateMessage = async (id1, id2, messageObj) => {
  const savedMessage = await models.savePrivateMessage(id1, id2, messageObj);
  return savedMessage;
};

const getChatRoomByNumber = async (room) => {
  const chatRoom = await models.getChatRoomByNumber(room);

  return chatRoom;
};

const createChatRoomAndSaveMessage = async (messageObj, room) => {
  const createdChatRoom = await models.createChatRoomAndSaveMessage(messageObj, room);
  return createdChatRoom;
};

const createPrivateChatRoomAndSaveMessage = async (id1, id2, messageObj) => {
  const savedMessage = await models.createPrivateChatRoomAndSaveMessage(
    id1, id2, messageObj,
  );
  return savedMessage;
};

const getPrivateMessages = async (id1, id2) => {
  const privateMessages = await models.getPrivateMessages(id1, id2);
  return privateMessages;
};

module.exports = {
  saveMessage,
  getChatRoomByNumber,
  createChatRoomAndSaveMessage,
  getPrivateMessages,
  createPrivateChatRoomAndSaveMessage,
  savePrivateMessage,
};
