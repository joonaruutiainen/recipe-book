import { Request, Response } from 'express';
import APIError from '../models/apiError';
import Recipe from '../models/recipe';
import makeResponse from '../utils/responseHandler';

const getRecipes = async (req: Request, res: Response) => {
  const recipes = await Recipe.find();
  return makeResponse.success(
    res,
    200,
    undefined,
    recipes.map(r => r.toJSON())
  );
};

const addRecipe = async (req: Request, res: Response) => {
  try {
    await Recipe.validateRecipeData(req.body);
  } catch (err) {
    if (err instanceof APIError) {
      return makeResponse.error(res, err);
    }
  }

  const recipe = new Recipe({ ...req.body });

  await recipe.save();

  return makeResponse.success(res, 200, 'Recipe added successfully', recipe.toJSON());
};

const getRecipe = async (req: Request, res: Response) => {
  res.status(200).json({
    message: `GET /recipes/${req.params.recipeId}`,
  });
};

const updateRecipe = async (req: Request, res: Response) => {
  res.status(200).json({
    message: `PUT /recipes/${req.params.recipeId}`,
  });
};

const deleteRecipe = async (req: Request, res: Response) => {
  res.status(200).json({
    message: `DELETE /recipes/${req.params.recipeId}`,
  });
};

const publishRecipe = async (req: Request, res: Response) => {
  res.status(200).json({
    message: `POST /recipes/${req.params.recipeId}/publish`,
  });
};

const recipeController = {
  getRecipes,
  addRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  publishRecipe,
};

export default recipeController;
