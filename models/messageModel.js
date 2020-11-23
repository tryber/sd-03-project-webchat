const getGeneral = (db) => () => db.collection('messages').find().sort({ date: 1 }).toArray();

const getPrivate = (db) => (users) => db.collection('messages').find({ users: { $all: users } }).sort({ date: 1 }).toArray();

const insertGeneral = (db) => ({ chatMessage, nickname }) => db.collection('messages').insertOne({ chatMessage, nickname, date: new Date() })
  .then((value) => value.ops[0]);

const insertPrivate = (db) => async ({ chatMessage, users }) => {
  const chat = await db.collection('messages').findOne({ users: { $all: users,
  } });

  if (chat) {
    return db.collection('messages').updateOne({ users: { $all: [
      { $elemMatch: users[0] },
      { $elemMatch: users[1] },
    ],
    } }, {
      $push: {
        messages: chatMessage,
      },
    });
  }
  return db.collection('messages')
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
