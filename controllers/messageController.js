const messagesService = require('../services/messagesService');

const newMessage = (io) => async (messageObj) => {
  io.emit('newText', messageObj);

  const chatRoom = await messagesService.getChatRoomByNumber(1);

  if (!chatRoom) {
    await messagesService.createChatRoomAndSaveMessage(messageObj, 1);
    return;
  }

  await messagesService.saveMessage(messageObj, 1);
};

const getAllMessages = async () => {
  const chatRoom = await messagesService.getChatRoomByNumber(1);
  return chatRoom.messagesArray;
};

module.exports = {
  newMessage,
  getAllMessages,
};
