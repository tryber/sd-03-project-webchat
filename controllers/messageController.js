const messagesService = require('../services/messagesService');

const newMessage = (io) => async ({ nickname, chatMessage }) => {
  const currentDate = new Date();
  const formattedDate = `
    ${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}
    ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}
  `;
  const message = `${nickname}: ${chatMessage} ${formattedDate}`;
  io.emit('message', message);

  const chatRoom = await messagesService.getChatRoomByNumber(1);

  if (!chatRoom) {
    await messagesService.createChatRoomAndSaveMessage({ nickname, chatMessage: message }, 1);
    return;
  }

  await messagesService.saveMessage({ nickname, chatMessage: message }, 1);
};

const getAllMessages = async () => {
  const chatRoom = await messagesService.getChatRoomByNumber(1);

  if (chatRoom === null) return [];

  return chatRoom.messagesArray;
};

const getPrivateMessages = async (id1, id2) => {
  const privateMessages = await messagesService.getPrivateMessages(id1, id2);

  if (privateMessages === null) return [];

  return privateMessages.messagesArray;
};

const savePrivateMessage = async (id1, id2, { nickname, chatMessage }) => {
  const currentDate = new Date();
  const formattedDate = `
    ${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}
    ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}
  `;
  const message = `${nickname}: ${chatMessage} ${formattedDate}`;

  const privateChatRoom = await messagesService.getPrivateMessages(id1, id2);

  if (!privateChatRoom) {
    await messagesService.createPrivateChatRoomAndSaveMessage(
      id1, id2, { nickname, chatMessage: message },
    );
    return;
  }

  await messagesService.savePrivateMessage(id1, id2, { nickname, chatMessage: message });
};

module.exports = {
  newMessage,
  getAllMessages,
  getPrivateMessages,
  savePrivateMessage,
};
