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

module.exports = {
  updateUser,
};
