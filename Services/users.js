class Users {
  constructor(models) {
    this.models = models;
  }

  markAsOnline = async (nickname) => {
    console.log(__dirname, this.models.Users);
    await this.models.Users.activate(nickname);
  }
}

module.exports = Users;
