const connection = require('./connection');

const updateUser = async (userId, nick) => {
  const db = await connection();
  db.collection('users').updateOne(
    {
      userId,
    },
    {
      $set: { userId, nick },
    },
    {
      upsert: true,
    },
  )
    .catch(({ status, message }) => {
      throw new Error(`${status} - ${message}`);
    });
};

module.exports = {
  updateUser,
};
