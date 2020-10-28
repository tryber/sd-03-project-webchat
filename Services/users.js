class Users {
  constructor(models) {
    this.models = models;
    this.guest = 0;
  }

  async markAsOnline(id, nickname) {
    await this.models.Users.activate(id, nickname);
  }

  async getAllOnline() {
    const users = await this.models.Users.getAll();
    return users.map(({ nickname }) => nickname);
  }

  async changeName(id, nickanme) {
    return this.models.Users.changeName(id, nickanme);
  }

  createName() {
    this.guest += 1;
    return `Guest${this.guest}`;
  }

  async removeUser(id) {
    return this.models.Users.deactivate(id);
  }
}

module.exports = Users;
