import express from "express"
import * as RecipeController from "../controllers/recipe.controller";
import multipart from "connect-multiparty"
import { auth_0, ensure_admin } from "../../../middlewares";
// const md_auth = require("../../../middlewares/auth.middleware");
const md_upload_recipeImage = multipart({ uploadDir: "./uploads/recipes" })
const api = express.Router()

api
	.post("/post-recipe", [auth_0], RecipeController.postRecipe)
	.put("/update-recipe-image/:id", [md_upload_recipeImage], RecipeController.updateImage)
	.get("/get-recipes/:orderBy", RecipeController.getRecipes)
	.get("/get-recipe/:id", RecipeController.getRecipe)
	.get("/get-recipe-image/:recipeImage", RecipeController.getRecipeImage)
	.post("/post-ingredient-type", [auth_0, ensure_admin], RecipeController.postIngredientType)

module.exports = api