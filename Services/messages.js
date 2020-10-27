class Messages {
  constructor(models) {
    this.models = models;
  }

  saveMessages = async ({ nickname, chatMessge }) => {
    this.models.Messages.saveChatMessage(nickname, chatMessge);
  }
}

module.exports = Messages;
