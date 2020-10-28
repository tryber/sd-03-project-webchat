const { ObjectId } = require('mongodb');
const mongoc = require('./connection');

const saveMessage = async ({ chatMessage, nickname }, timestamp) =>
  mongoc.connect()
  .then((db) => db
    .collection('messages')
    .insertOne({ chatMessage, nickname, timestamp }))
    .then(({ insertedId }) => ({ _id: insertedId, chatMessage, nickname, timestamp }))
    .catch((error) => error);

const getAllMessages = async () =>
  mongoc.connect()
  .then((db) => db
    .collection('messages')
    .find({})
    .toArray(),
  )
  .catch((error) => error);

// const getProductByName = async (name) =>
//   mongoc.connect()
//   .then((db) => db
//     .collection('products')
//     .findOne({ name }),
//   )
//   .catch((error) => error);

// const getProductById = async (id) => mongoc.connect()
//   .then((db) => db.collection('products').findOne(ObjectId(id)))
//   .catch((error) => error);

// const updateProductById = async (id, name, quantity) => mongoc.connect()
//   .then((db) => db.collection('products')
//     .updateOne({ _id: ObjectId(id) }, { $set: { name, quantity } }))
//   .then(() => ({ _id: id, name, quantity }))
//   .catch((error) => error);

// const deleteProductById = async (id, name, quantity) => mongoc.connect()
//   .then((db) => db.collection('products')
//     .deleteOne({ _id: ObjectId(id) }))
//   .then(() => ({ _id: id, name, quantity }))
//   .catch((error) => error);

// const createSaletInDB = async (products) =>
//   mongoc.connect()
//   .then((db) => db
//     .collection('sales')
//     .insertOne({ itensSold: [...products] }))
//     .then(({ insertedId }) => ({ _id: insertedId, itensSold: [...products] }))
//     .catch((error) => error);

// const getAllSales = async () =>
//   mongoc.connect()
//     .then((db) => db
//       .collection('sales')
//       .find({})
//       .toArray(),
//     )
//     .catch((error) => error);

// const getSaleById = async (id) => mongoc.connect()
//   .then((db) => db.collection('sales').findOne(ObjectId(id)))
//   .catch((error) => error);

// const updateSaleById = async (id, productId, quantity) => {
//   const itensSold = [{ productId, quantity }];
//   return mongoc.connect()
//   .then((db) => db.collection('sales')
//     .updateOne(
//       { _id: ObjectId(id) },
//       { $set: { itensSold } },
//   ))
//   .then(() => ({ _id: id, itensSold }))
//   .catch((error) => error);
// };

// const deleteSaleById = async (id) => mongoc.connect()
//   .then((db) => db.collection('sales')
//     .deleteOne({ _id: ObjectId(id) }))
//   .catch((error) => error);

module.exports = {
  // getProductByName,
  saveMessage,
  getAllMessages,
  // getProductById,
  // updateProductById,
  // deleteProductById,
  // createSaletInDB,
  // getAllSales,
  // getSaleById,
  // updateSaleById,
  // deleteSaleById,
};
