const { MongoClient } = require('mongodb');

const connect = ({ DB_URL, DB_NAME }) => async () => {
  try {
    const conn = await MongoClient.connect(DB_URL || 'mongodb://localhost:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return conn.db(DB_NAME || 'webchat');
  } catch (err) {
    console.error('inside connect', err);
    process.exit(1);
  }
};

const connectTo = (config) => async (coll, connection = connect) => {
  try {
    const db = await connection(config)();
    return db.collection(coll);
  } catch (err) {
    console.error('inside connectTo', err);
  }
};

module.exports = { connect, connectTo };
