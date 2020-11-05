const getGeneral = (db) => () => db.collection('general').find({}).sort({ date: 1 }).toArray();

const getPrivate = (db) => (users) => db.collection('private').find({ users: { $all: users } }).sort({ date: 1 }).toArray();

// TODO upsert

const insertGeneral = (db) => ({ chatMessage, nickname }) => db.collection('general').insertOne({ chatMessage, nickname })
  .then((value) => value.ops[0]);

const insertPrivate = (db) => ({ chatMessage, users }) => db.collection('private')
  .updateOne(
    { users: { $all: [
      { $elemMatch: users[0] },
      { $elemMatch: users[1] },
    ],
    } },
    {
      $setOnInsert: {
        users,
        $push: {
          messages: [chatMessage],
        },
      },
    },
    { upsert: true },
  )

  .then((value) => value.ops[0]);

const factory = (connect) => ({
  getGeneral: getGeneral(connect),
  getPrivate: getPrivate(connect),
  insertGeneral: insertGeneral(connect),
  insertPrivate: insertPrivate(connect),
});

module.exports = factory;
