const { ObjectId } = require('mongodb');
const connection = require('./connect');

const getAllUsers = async () => connection().then((db) => db.collection('user').find({}).toArray());

module.exports = {getAllUsers};