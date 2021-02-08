const messageService = require('../services/messageService');

const getAllMessages = async () => {
  const chatRoom = await messageService.getChatRoomByNumber(1);

  if (chatRoom === null) return [];

  return chatRoom.messagesArray;
};

const getPrivateMessages = async (id1, id2) => {
  const privateMessages = await messageService.getPrivateMessages(id1, id2);

  if (privateMessages === null) return [];

  return privateMessages.messagesArray;
};

const newMessage = (io) => async ({ nickname, chatMessage }) => {
  const currentDate = new Date();
  const formattedDate = `
    ${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}
    ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}
  `;
  const message = `${nickname}: ${chatMessage} ${formattedDate}`;
  io.emit('message', message);

  const chatRoom = await messageService.getChatRoomByNumber(1);

  if (!chatRoom) {
    await messageService.createChatRoomAndSaveMessage({ nickname, chatMessage: message }, 1);
    return;
  }

  await messageService.saveMessage({ nickname, chatMessage: message }, 1);
};

const savePrivateMessage = async (id1, id2, { nickname, chatMessage }) => {
  const date = new Date();
  const formattedDate = `
    ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}
    ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
  `;
  const message = `${nickname}: ${chatMessage} ${formattedDate}`;

  const privateChatRoom = await messageService.getPrivateMessages(id1, id2);

  if (!privateChatRoom) {
    await messageService.createPrivateChatRoomAndSaveMessage(
      id1, id2, { nickname, chatMessage: message },
    );
    return;
  }

  await messageService.savePrivateMessage(id1, id2, { nickname, chatMessage: message });
};

module.exports = {
  newMessage,
  getAllMessages,
  getPrivateMessages,
  savePrivateMessage,
};
