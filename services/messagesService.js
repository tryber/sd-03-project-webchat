const messagesModel = require('../models/messagesModel');

const saveMessage = async (messageObj, room) => {
  const newMessage = await messagesModel.saveMessageOnDb(messageObj, room);
  return newMessage;
};

const getChatRoomByNumber = async (room) => {
  const chatRoom = await messagesModel.getChatRoomByNumber(room);

  return chatRoom;
};

module.exports = {
  saveMessage,
  getChatRoomByNumber,
};
