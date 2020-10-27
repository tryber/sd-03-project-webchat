class Messages {
  constructor({ connectTo, config }) {
    this.connectTo = connectTo(config);
  }

  async saveChatMessage(nickname, chatMessage) {
    const coll = await this.connectTo('messages');
    const time = new Date();
    await coll.insertOne({ nickname, chatMessage, time });
    return { nickname, chatMessage, time };
  }
}

module.exports = Messages;
