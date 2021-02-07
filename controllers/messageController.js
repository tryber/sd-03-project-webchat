const messagesService = require('../services/messageService');

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

const newMessage = (io) => async ({ nickname, msgChat }) => {
  const currentDate = new Date();
  const formattedDate = `
    ${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}
    ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}
  `;
  const msgFormated = `${nickname}: ${msgChat} ${formattedDate}`;

  io.emit('message', msgFormated);

  const chatRoom = await messagesService.getChatRoomByNumber(1);

  if (!chatRoom) {
    await messagesService.createChatRoomAndSaveMessage({ nickname, msg: msgFormated }, 1);
    return;
  }

  await messagesService.saveMessage({ nickname, msg: msgFormated }, 1);
};

const savePrivateMessage = async (id1, id2, { nickname, chatMessage }) => {
  const date = new Date();
  const formattedDate = `
    ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}
    ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
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
