const messagesModel = require('../models/messagesModel');

const saveMessage = async (messageObj, room) => {
  const newMessage = await messagesModel.saveMessageOnDb(messageObj, room);
  return newMessage;
};

const getChatRoomByNumber = async (room) => {
  const chatRoom = await messagesModel.getChatRoomByNumber(room);
  return chatRoom;
};

const createChatRoomAndSaveMessage = async (messageObj, room) => {
  const createdChatRoom = await messagesModel.createChatRoomAndSaveMessage(messageObj, room);
  return createdChatRoom;
};

module.exports = {
  saveMessage,
  getChatRoomByNumber,
  createChatRoomAndSaveMessage,
};
