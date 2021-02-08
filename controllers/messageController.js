const services = require('../services/messagesService');

// Fonte formato de data: https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
const emitNewMessage = (io) => async ({ nickname, chatMessage }) => {
  const currentDate = new Date();
  const formattedDate = `
    ${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}
    ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}
  `;
  const message = `${nickname}: ${chatMessage} ${formattedDate}`;
  io.emit('message', message);
  const chatRoom = await services.getChatRoomByNumber(1);
  if (!chatRoom) {
    await services.createChatRoomAndSaveMessage({ nickname, chatMessage: message }, 1);
    return;
  }

  await services.saveMessage({ nickname, chatMessage: message }, 1);
};

const getAllMessages = async () => {
  const chatRoom = await services.getChatRoomByNumber(1);

  if (chatRoom === null) return [];

  return chatRoom.messagesArray;
};

const getPrivateMessages = async (id1, id2) => {
  const returnPrivateMessages = await services.getPrivateMessages(id1, id2);

  if (returnPrivateMessages === null) return [];

  return returnPrivateMessages.messagesArray;
};

const saveMsgPrivate = async (id1, id2, { nickname, chatMessage }) => {
  const currentDate = new Date();
  const formattedDate = `
    ${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}
    ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}
  `;
  const message = `${nickname}: ${chatMessage} ${formattedDate}`;

  const privateChatRoom = await services.getPrivateMessages(id1, id2);

  if (!privateChatRoom) {
    await services.createPrivateChatRoomAndSaveMessage(
      id1, id2, { nickname, chatMessage: message },
    );
    return;
  }

  await services.savePrivateMessage(id1, id2, { nickname, chatMessage: message });
};

module.exports = {
  emitNewMessage,
  getAllMessages,
  getPrivateMessages,
  saveMsgPrivate,
};
