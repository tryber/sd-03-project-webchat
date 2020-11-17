const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createRecipe = async (id, name, ingredients, preparation) => connection()
  .then((db) => db.collection('recipes').insertOne({ name, ingredients, preparation, userId: id }))
  .then(({ insertedId }) => ({ _id: insertedId, name, ingredients, preparation, userId: id }));

const deleteRecipe = async (id) => connection()
  .then((db) => db.collection('recipes').deleteOne({ _id: ObjectId(id) }))
  .then((recipe) => ({ ...recipe }));

const getAllRecipes = async () => connection()
  .then((db) => db.collection('recipes').find().toArray());

const getRecipeById = async (id) => connection()
  .then((db) => db.collection('recipes').findOne(ObjectId(id)));

const updateRecipe = async (id, name, ingredients, preparation, userId) => connection()
  .then((db) => db
    .collection('recipes')
    .updateOne({ _id: ObjectId(id) }, { $set: { name, ingredients, preparation } }))
  .then(() => ({ _id: ObjectId(id), name, ingredients, preparation, userId }));

const updateRecipeImage = async (id, image) => connection()
  .then((db) => db.collection('recipes').updateOne({ _id: ObjectId(id) }, { $set: { image } }));

module.exports = {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  updateRecipeImage,
};
