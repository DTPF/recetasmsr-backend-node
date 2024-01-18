const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ToolSchema = new Schema({
  name: String,
  toolType: {
    type: Schema.Types.ObjectId,
    ref: 'ToolType'
  },
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  recipesCount: Number
}, {
  timestamps: true
})

module.exports = mongoose.model("Tool", ToolSchema)