const moment = require('moment');

class Messages {
  constructor({ connectTo, config }) {
    this.connectTo = connectTo(config);
  }

  async saveChatMessage(nickname, chatMessage) {
    const coll = await this.connectTo('messages');
    const time = moment().format('D-M-yyyy hh:mm:ss');
    await coll.insertOne({ nickname, chatMessage, time });
    return { nickname, chatMessage, time };
  }

  async getAll() {
    const coll = await this.connectTo('messages');
    return coll.find().toArray();
  }
}

module.exports = Messages;
