const Models = require("../Models");

class Users {
  constructor(models) {
    this.models = models;
  }

  markAsOnline = async (id, nickname) => {
    await this.models.Users.activate(id, nickname);
  }

  async remove(id) {
    console.log('entrou ak');
    await this.models.Users.deactivate(id);
  }
}

module.exports = Users;
