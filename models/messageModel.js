const getGeneral = (db) => () => db.collection('general').find().sort({ date: 1 }).toArray();

const getPrivate = (db) => (users) => db.collection('private').find({ users: { $all: users } }).sort({ date: 1 }).toArray();

// TODO upsert

const insertGeneral = (db) => ({ chatMessage, nickname }) => db.collection('general').insertOne({ chatMessage, nickname, date: new Date() })
  .then((value) => value.ops[0]);

const insertPrivate = (db) => async ({ chatMessage, users }) => {
  const chat = await db.collection('private').findOne({ users: { $all: users,
  } });

  if (chat) {
    return db.collection('private').updateOne({ users: { $all: [
      { $elemMatch: users[0] },
      { $elemMatch: users[1] },
    ],
    } }, {
      $push: {
        messages: chatMessage,
      },
    });
  }
  return db.collection('private')
    .insertOne(
      {
        users,
        messages: [chatMessage],
      },

    );
};
const factory = (connect) => ({
  getGeneral: getGeneral(connect),
  getPrivate: getPrivate(connect),
  insertGeneral: insertGeneral(connect),
  insertPrivate: insertPrivate(connect),
});

module.exports = factory;
