const models = require('../models/messagesModel');

const saveMessage = async (msgObj, room) => {
  const newMessage = await models.saveMessageOnDb(msgObj, room);
  return newMessage;
};

const savePrivateMessage = async (id1, id2, msgObj) => {
  const savedMessage = await models.savePrivateMessage(id1, id2, msgObj);
  return savedMessage;
};

const getChatRoomByNumber = async (room) => {
  const chatRoom = await models.getChatRoomByNumber(room);

  return chatRoom;
};

const createChatRoomAndSaveMessage = async (msgObj, room) => {
  const createdChatRoom = await models.createChatRoomAndSaveMessage(msgObj, room);
  return createdChatRoom;
};

const createPrivateChatRoomAndSaveMessage = async (id1, id2, msgObj) => {
  const savedMessage = await models.createPrivateChatRoomAndSaveMessage(
    id1, id2, msgObj,
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
