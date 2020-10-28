class Users {
  constructor(models) {
    this.models = models;
  }

  async markAsOnline(id, nickname) {
    await this.models.Users.activate(id, nickname);
  }

  async remove(id) {
    await this.models.Users.deactivate(id);
  }
}

module.exports = Users;
