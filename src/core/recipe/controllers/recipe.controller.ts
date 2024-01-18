import { Request, Response, NextFunction } from "express";
const fs = require("fs-extra")
const path = require("path")
const db = require("../../modelIndex")
const { response500, makeResponse } = require('../../../utils/makeResponse')

export function postRecipe(req: Request, res: Response) {
  const recipe = new db.Recipe()
  const {
    title,
    cookingTime,
    ingredients,
    tools,
    preparation,
    rations,
    difficulty,
    cookType,
    image,
    author,
    comments
  } = req.body

  recipe.title = title
  recipe.cookingTime = cookingTime
  recipe.ingredients = ingredients
  recipe.tools = tools
  recipe.preparation = preparation
  recipe.rations = rations
  recipe.difficulty = difficulty
  recipe.cookType = cookType
  recipe.image = image
  recipe.author = author
  recipe.comments = comments

  recipe.save((err: any, recipeStored: any) => {
    if (err) {
      if (err.code == 11000) {
        res.status(400).send({ code: 400, status: "duplicated", message: `~${err.keyValue.title}~ ya existe.` })
      } else if (err.errors.cookingTime.properties.type == "required") {
        res.status(400).send({ code: 400, status: "required", message: 'El tiempo de cocinado es obligatorio.' })

      } else {
        res.status(400).send({ code: 500, status: "server-error", message: 'Error del servidor.' })
        return
      }
    } else if (!recipeStored) {
      res.status(404).send({ code: 404, status: "recipe-error", message: "Error al crear el usuario." })
      return
    } else {
      res.status(200).send({
        code: 200,
        status: "recipe-created",
        message: "Receta creada correctamente."
      })
    }
  })
}

export async function getRecipes(req: Request, res: Response) {
  const params = req.params
  try {
    const recipes = await db.Recipe.find().sort({ createdAt: params.orderBy }).lean().exec()
    return makeResponse(res, 200, 'Get gif`s successful', recipes)
  } catch (err) {
    return response500(res, err)
  }
}

export function getRecipe(req: Request, res: Response) {
  const params = req.params

  db.Recipe.findById({ _id: params.id }, (err: any, recipeData: any) => {
    if (err) {
      return res.status(500).send({ code: 500, status: "server-error", message: "Error del servidor." })
    }
    if (!recipeData) {
      return res.status(404).send({ code: 404, status: "recipe-not-found-server", message: "No se ha encontrado la receta." })
    }
    return res.status(200).send({ code: 200, status: "success", recipe: recipeData })
  })
}

export function updateImage(req: any, res: Response) {
  const params = req.params
  const path = req.files.recipeImage && req.files.recipeImage.path
  db.Recipe.findById({ _id: params.id }, (err: any, recipeData: any) => {
    if (err) {
      res.status(500).send({ code: 500, status: "server-error", message: "Error del servidor." })
      path && fs.unlinkSync(path)
      return
    }
    if (!recipeData) {
      res.status(404).send({ code: 404, status: "recipe-not-found-server", message: "No se ha encontrado la receta." })
      path && fs.unlinkSync(path)
      return
    }
    let recipe = recipeData
    recipe.updatedAt = Date.now()
    const recipeImageNameOld = recipe.recipeImage
    const filePathOld = "./uploads/recipes/" + recipeImageNameOld
    if (req.files.recipeImage) {
      let filePath = req.files.recipeImage.path
      let fileSplit = filePath.split("/")
      let fileName = fileSplit[2]
      let extSplit = fileName.split(".")
      let fileExt = extSplit[1] && extSplit[1].toLowerCase()

      if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
        res.status(400).send({
          code: 400,
          status: "extension-not-valid",
          message:
            "La extensión de la imagen no es válida. (Extensiones permitidas: .png y .jpg)",
        })
        path && fs.unlinkSync(path)
        return
      }

      recipe.recipeImage = fileName
      db.Recipe.findByIdAndUpdate({ _id: params.id }, recipe, (err: any, recipeResult: any) => {
        if (err) {
          res.status(500).send({ code: 500, status: "server-error", message: "Error del servidor." })
          path && fs.unlinkSync(path)
          return
        }
        if (!recipeResult) {
          res.status(404).send({ code: 404, status: "recipe-not-found", message: "No se ha encontrado la receta." })
          path && fs.unlinkSync(path)
          return
        }
        (recipeImageNameOld !== undefined) && fs.unlinkSync(filePathOld)
        res.status(200).send({ code: 200, status: "recipe-image-upload", recipeImageName: fileName })
      })
    } else {
      res.status(404).send({ code: 404, status: "image-empty", message: "Sube la imágen." })
      path && fs.unlinkSync(path)
    }
  })
}

export function getRecipeImage(req: Request, res: Response) {
  const imageName = req.params.recipeImage
  const filePath = "./uploads/recipes/" + imageName

  fs.exists(filePath, (exists: boolean) => {
    if (!exists) {
      res.status(404).send({ code: 404, status: "image-not-exists", message: "La imágen que buscas no existe." })
    } else {
      res.sendFile(path.resolve(filePath))
    }
  })
}

export async function postIngredientType(req: Request, res: Response) {
  const { name } = req.body
  try {
    const ingredientType = new db.IngredientType({ name })
    const ingredientTypeStored = await ingredientType.save()
    return res.status(200).send({ status: "created-successfully", message: "Se ha creado correctamente.", ingredientType: ingredientTypeStored })
  } catch (err: any) {
    if (err.code == 11000) {
      return res.status(400).send({ status: "type-exists", message: 'El tipo de ingrediente ya existe' })
    }
    return res.status(500).send({ status: "server-error", message: 'Server error', error: err })
  }
}