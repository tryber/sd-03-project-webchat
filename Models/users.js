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
    const user = await coll.findOne({ id });
    await coll.deleteOne({ id });
    return user;
  }

  async getAll() {
    const coll = await this.connectTo('users');
    return coll.find().toArray();
  }

  async changeName(id, nickname) {
    const coll = await this.connectTo('users');
    const user = await coll.findOne({ id });
    await coll.updateOne({ id }, { $set: { nickname } });
    return user;
  }
}

module.exports = Users;
