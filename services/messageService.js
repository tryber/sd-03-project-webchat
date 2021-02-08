const messagesModel = require('../models/messagesModel'); 
// NESTE ARQUIVO SIMPLESMENTE ESTOU CHAMANDO AS FUNÇÕES QUE CRIEI NO MODEL

//recebe msg na sala e simplesmente chama salvarMensagem do model
const saveMessage = async (messageObj, room) => {
  const newMessage = await messagesModel.saveMsgBase(messageObj, room);
  return newMessage;
};

//só chama a função do MODEL
const getChatRoomByNumber = async (room) => {
  const chatRoom = await messagesModel.getChatRoomByNumber(room);

  return chatRoom;
};

//só CHAMA do model tbm
const createChatRoomAndSaveMessage = async (messageObj, room) => {
  const createdChatRoom = await messagesModel.createChatRoomAndSaveMessage(messageObj, room);
  return createdChatRoom;
};

const getPrivateMessages = async (id1, id2) => {
  const privateMessages = await messagesModel.getPrivateMessages(id1, id2);
  return privateMessages;
};

const createPrivateChatRoomAndSaveMessage = async (id1, id2, messageObj) => {
  const savedMessage = await messagesModel.createPrivateChatRoomAndSaveMessage(
    id1, id2, messageObj,
  );
  return savedMessage;
};

const savePrivateMessage = async (id1, id2, messageObj) => {
  const savedMessage = await messagesModel.savePrivateMessage(id1, id2, messageObj);
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
