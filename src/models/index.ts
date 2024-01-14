const User = require('./user.model')
const Recipe = require('./recipes/recipe.model')
const Ingredient = require('./recipes/ingredient.model')
const IngredientType = require('./recipes/ingredientType.model')
const Tool = require('./recipes/tool.model')
const ToolType = require('./recipes/toolType.model')

module.exports = {
	User,
	Recipe,
	Ingredient,
	IngredientType,
	Tool,
	ToolType
}