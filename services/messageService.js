const messagesModel = require('../models/messagesModel'); 

const saveMessage = async (msgObj, room) => {
  const newMessage = await messagesModel.saveMsgBase(msgObj, room);
  return newMessage;
};

const getChatRoomByNumber = async (room) => {
  const chatRoom = await messagesModel.getChatRoomByNumber(room);
  return chatRoom;
};

const createChatRoomAndSaveMessage = async (msgObj, room) => {
  const createdChatRoom = await messagesModel.createChatRoomAndSaveMessage(msgObj, room);
  return createdChatRoom;
};

const createPrivateChatRoomAndSaveMessage = async (id1, id2, msgObj) => {
  const saveMessage = await messagesModel.createPrivateChatRoomAndSaveMessage(
    id1, id2, msgObj,
  );
  return saveMessage;
};

const getPrivateMessages = async (id1, id2) => {
  const privateMessages = await messagesModel.getPrivateMessages(id1, id2);
  return privateMessages;
};

const savePrivateMessage = async (id1, id2, msgObj) => {
  const savedMessage = await messagesModel.savePrivateMessage(id1, id2, msgObj);
  return savedMessage;
};

module.exports = {
  saveMessage,
  getChatRoomByNumber,
  createChatRoomAndSaveMessage,
  getPrivateMessages,
  createPrivateChatRoomAndSaveMessage,
  savePrivateMessage,
};
