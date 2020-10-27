class Messages {
  constructor({ connectTo }) {
    this.connectTo = connectTo;
  }

  async saveChatMessage(nickname, chatMessage) {
    const coll = await this.connecTo();
    const time = new Date();
    await coll.insertOne({ nickname, chatMessage, time });
    return { nickname, chatMessage, time };
  }
}

module.exports = Messages;
