class Users {
  constructor({ config, connectTo }) {
    this.connectTo = connectTo(config);
  }

  activate = async (id, nickname) => {
    const coll = await this.connectTo('users');

    return await coll.insertOne({ id, nickname });
  }

  deactivate = async (id) => {
    const coll = await this.connectTo('users');
    await coll.deleteOne({ id });
  }
}

module.exports = Users;
