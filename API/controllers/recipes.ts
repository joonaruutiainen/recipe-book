import { Request, Response } from 'express';
import { Error as DBError } from 'mongoose';
import Recipe from '../models/recipe';
import APIError from '../models/apiError';
import makeResponse from '../utils/responseHandler';

const validateRecipeId = async (req: Request) => {
  const { recipeId } = req.params;
  if (!recipeId) return Promise.reject(new APIError('Missing route parameter: recipeId', 403));

  let recipe;
  try {
    recipe = await Recipe.findById(recipeId).exec();
  } catch (err) {
    if (err instanceof DBError.CastError) return Promise.reject(new APIError('Invalid recipeId', 403));
  }

  if (!recipe) return Promise.reject(new APIError(`No recipe found with ID ${recipeId}`, 404));
  return Promise.resolve(recipe);
};

const addRecipe = async (req: Request, res: Response) => {
  try {
    await Recipe.validateRecipeData(req.body);
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
  }

  const recipe = new Recipe({ ...req.body });

  try {
    await recipe.save();
  } catch (err) {
    return makeResponse.error(res, new APIError('Internal server error when saving recipe to database', 500));
  }

  return makeResponse.success(res, 200, 'New recipe added successfully', recipe.toJSON());
};

const getRecipes = async (req: Request, res: Response) => {
  const recipes = await Recipe.find();
  if (!recipes) return makeResponse.error(res, new APIError('"Recipes" not found', 404));

  return makeResponse.success(
    res,
    200,
    `${recipes.length} recipes fetched successfully`,
    recipes.map(r => r.toJSON())
  );
};

const getRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);
    return makeResponse.success(res, 200, 'Recipe fetched successfully', recipe.toJSON());
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when fetching recipe from database', 500));
  }
};

const updateRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);
    let updatedRecipe = { ...recipe.toJSON(), ...req.body };

    await Recipe.validateRecipeData(updatedRecipe);

    updatedRecipe = await Recipe.findOneAndUpdate({ _id: recipe.id }, updatedRecipe, { returnDocument: 'after' });

    return makeResponse.success(res, 200, 'Recipe updated successfully', updatedRecipe);
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when updating recipe in database', 500));
  }
};

const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);

    await recipe.delete();

    return makeResponse.success(res, 200, 'Recipe deleted successfully');
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when deleting recipe from database', 500));
  }
};

const publishRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);
    recipe.public = true;

    await recipe.save();

    return makeResponse.success(res, 200, 'Recipe published successfully');
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when updating recipe in database', 500));
  }
};

const recipeController = {
  addRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  publishRecipe,
};

export default recipeController;
