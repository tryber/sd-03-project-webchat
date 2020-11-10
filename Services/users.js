class Users {
  constructor(models) {
    this.models = models;
  }

  async markAsOnline(id, nickname) {
    await this.models.Users.insertOne({ id, nickname: nickname || this.createName });
  }

  async getAllOnline() {
    const users = await this.models.Users.getAll();
    return users.map(({ nickname }) => nickname);
  }

  async changeName(id, nickanme) {
    return this.models.Users.changeName(id, nickanme);
  }

  createName() {
    const id = this.models.Users.getGuestId();
    return `Guest${id}`;
  }

  async removeUser(id) {
    return this.models.Users.deactivate(id);
  }
}

module.exports = Users;
