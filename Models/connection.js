const { MongoClient } = require('mongodb');

const connect = ({ MONGO_DB_URL, DB_NAME }) => async () => {
  try {
    const conn = await MongoClient.connect(MONGO_DB_URL || 'mongodb://mongodb:27017/StoreManager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return conn.db(DB_NAME || 'WebChat');
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

module.exports = (config) => ({ connect: connect(config), connectTo: connectTo(config) });
