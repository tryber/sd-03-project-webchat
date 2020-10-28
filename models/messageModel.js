const getGeneral = (db) => () => db.collection('general').find({}).sort({ date: 1 }).toArray();

const insertGeneral = (db) => ({ chatMessage, nickname, date }) => db.collection('general').insertOne({ chatMessage, nickname, date })
  .then((value) => value.ops[0]);

const factory = (connect) => ({
  getGeneral: getGeneral(connect),
  insertGeneral: insertGeneral(connect),
});

module.exports = factory;
