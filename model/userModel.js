const connection = require('./connection');

const updateUser = async (userId, nickname) => {
  const db = await connection();
  db.collection('users').updateOne(
    {
      userId,
    },
    {
      $set: { userId, nickname },
    },
    {
      upsert: true,
    },
  )
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

const removeUser = async (userId) => {
  const db = await connection();
  db.collection('users').removeOne(
    {
      userId,
    },
  )
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

const getUsers = async () => {
  const db = await connection();
  return db.collection('users').find().toArray()
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

const deleteUsers = async (userId = {}) => {
  const db = await connection();
  await db.collection('users').deleteMany(userId)
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

module.exports = {
  updateUser,
  removeUser,
  getUsers,
  deleteUsers,
};
