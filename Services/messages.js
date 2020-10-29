const formatMessages = (messages) => {
  if (!Array.isArray(messages)) {
    return `${messages.nickname} ${messages.time} ${messages.chatMessage}`;
  }
  return messages.map((message) =>
    `${message.nickname} ${message.time} ${message.chatMessage}`);
};

class Messages {
  constructor(models) {
    this.models = models;
    this.formatMessages = formatMessages;
  }

  async saveMessages({ chatMessage, nickname }) {
    return this.models.Messages.saveChatMessage(nickname, chatMessage);
  }

  async takeAll() {
    return this.models.Messages.getAll();
  }
}

module.exports = Messages;
