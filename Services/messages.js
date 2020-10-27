class Messages {
  constructor(models) {
    this.models = models;
  }

  async saveMessages({ chatMessage, nickname }) {
    return this.models
      .Messages.saveChatMessage(nickname, chatMessage);
  }
}

module.exports = Messages;
