const mongoose = require("mongoose")
const Schema = mongoose.Schema

const IngredientSchema = new Schema({
  name: String,
  calories: Number,
  protein: Number,
  carbohydrates: Number,
  fat: Number,
  // ingredientType: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'IngredientType'
  // },
  // recipes: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Recipe'
  // }],
  // recipesCount: Number
}, {
  timestamps: true
})

module.exports = mongoose.model("Ingredient", IngredientSchema)