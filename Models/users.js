class Users {
  constructor({ config, connectTo }) {
    this.connectTo = connectTo(config);
  }

  activate = async ({ nickname }) => {
    const coll = await this.connectTo('users');
    await coll.insertOne({ nickname });
  }

  deactivate = async () => {
    const coll = await this.connectTo('users');
    await coll.deleteOne({ nickname });
  }
}

module.exports = Users;
