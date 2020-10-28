class Users {
  constructor({ config, connectTo }) {
    this.connectTo = connectTo(config);
  }

  async activate(id, nickname) {
    const coll = await this.connectTo('users');

    return coll.insertOne({ id, nickname });
  }

  async deactivate(id) {
    const coll = await this.connectTo('users');
    await coll.deleteOne({ id });
  }
}

module.exports = Users;
