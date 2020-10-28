class Users {
  constructor() {
    this.users = [];
    this.guest = 0;
  }

  async insertOne({ id, nickname }) {
    console.log('INSERT', nickname, this.users.map(({ nickname: n }) => n), '\n');
    this.users.push({ id, nickname });
    return { id, nickname };
  }

  async getUserById(id) {
    return this.users.find((user) => user.id === id);
  }

  async deactivate(id) {
    const user = await this.getUserById(id);
    console.log('REMOVE', user.nickname, this.users.map(({ nickname }) => nickname), '\n');
    this.users = this.users.reduce((users, u) => {
      if (id === u.id) return users;
      return [...users, u];
    }, []);

    return user;
  }

  getGuestId() {
    this.guest += 1;
    return this.guest;
  }

  async getAll() {
    return this.users;
  }

  async changeName(id, nickname) {
    const user = await this.getUserById(id);
    console.log('CHANGE', `${user.nickname} => ${nickname}`, this.users.map(({ nickname: n }) => n), '\n');
    const before = { ...user };
    user.nickname = nickname;
    return before;
  }
}

module.exports = Users;
