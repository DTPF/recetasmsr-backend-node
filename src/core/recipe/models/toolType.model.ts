const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ToolTypeSchema = new Schema({
  name: String,
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  recipesCount: Number
}, {
  timestamps: true
})

module.exports = mongoose.model("ToolType", ToolTypeSchema)