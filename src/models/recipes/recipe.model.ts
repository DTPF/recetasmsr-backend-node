const mongoose = require("mongoose")
const Schema = mongoose.Schema

const RercipeSchema = new Schema({
  userId: String,
  title: { type: String, unique: true, required: true },
  cookingTime: { type: String, required: true },
  // ingredients: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Ingredient'
  // }],
  ingredients: [{
    name: String,
    quantity: Number,
    unit: String,
  }],
  tools: [{
    type: Schema.Types.ObjectId,
    ref: 'Tool'
  }],
  preparation: String,
  rations: Number,
  difficulty: String,
  cookType: String,
  recipeImage: String,
  author: String,
  comments: String,
}, {
  timestamps: true
})

module.exports = mongoose.model("Recipe", RercipeSchema)