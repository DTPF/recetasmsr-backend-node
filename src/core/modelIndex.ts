const User = require('./user/models/user.model')
const Recipe = require('./recipe/models/recipe.model')
const Ingredient = require('./recipe/models/ingredient.model')
const IngredientType = require('./recipe/models/ingredientType.model')
const Tool = require('./recipe/models/tool.model')
const ToolType = require('./recipe/models/toolType.model')

module.exports = {
	User,
	Recipe,
	Ingredient,
	IngredientType,
	Tool,
	ToolType
}