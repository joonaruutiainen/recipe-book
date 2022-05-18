import { Request, Response } from 'express';
import { Error as DBError } from 'mongoose';
import path from 'path';
import Recipe from '../models/recipe';
import APIError from '../models/apiError';
import makeResponse from '../utils/responseHandler';
import loadUserFromRequest from '../utils/loadUser';
import { IRecipe } from '../models/types';

export const validateRecipeId = async (req: Request) => {
  const { recipeId } = req.params;
  if (!recipeId) return Promise.reject(new APIError('Missing route parameter: recipeId', 400));

  let recipe;
  try {
    recipe = await Recipe.findById(recipeId).exec();
  } catch (err) {
    if (err instanceof DBError.CastError) return Promise.reject(new APIError('Invalid recipeId', 400));
  }

  if (!recipe) return Promise.reject(new APIError(`No recipe found with ID ${recipeId}`, 404));
  return Promise.resolve(recipe);
};

const addRecipe = async (req: Request, res: Response) => {
  try {
    const { user, error } = await loadUserFromRequest(req);

    if (error) throw new APIError(error, 500);

    const recipeData = { ...req.body, user: { id: user?.id, name: user?.name } };
    await Recipe.validateRecipeData(recipeData);

    const recipe = new Recipe(recipeData);
    await recipe.save();

    return makeResponse.success(res, 201, 'New recipe added successfully', recipe.toJSON());
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when saving recipe to database', 500));
  }
};

const getRecipes = async (req: Request, res: Response) => {
  try {
    const { user } = await loadUserFromRequest(req);

    let recipes;

    if (!user) recipes = await Recipe.find({ public: true }).exec();
    else if (user?.admin) recipes = await Recipe.find().exec();
    else recipes = await Recipe.find({ $or: [{ 'user.id': user?.id }, { public: true }] }).exec();

    if (!recipes) return makeResponse.error(res, new APIError('"Recipes" not found', 404));

    return makeResponse.success(
      res,
      200,
      `${recipes.length} recipes fetched successfully`,
      recipes.map(r => r.toJSON())
    );
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when fetching recipes from database', 500));
  }
};

const getRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);
    return makeResponse.success(res, 200, 'Recipe fetched successfully', recipe.toJSON());
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when fetching recipe from database', 500));
  }
};

const updateRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);

    // recipe.public and recipe.user are not allowed to be modified with update recipe request
    const { public: recipeIsPublic, user, ...dataToUpdate } = req.body;
    let updatedRecipe = { ...recipe.toJSON(), ...dataToUpdate };

    await Recipe.validateRecipeData(updatedRecipe);

    updatedRecipe = await Recipe.findOneAndUpdate({ _id: recipe.id }, updatedRecipe, { returnDocument: 'after' });

    return makeResponse.success(res, 200, 'Recipe updated successfully', updatedRecipe);
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when updating recipe in database', 500));
  }
};

const uploadImage = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);

    const image = req.file?.filename;
    let updatedRecipe: IRecipe | null = { ...recipe.toJSON(), image };

    updatedRecipe = await Recipe.findOneAndUpdate({ _id: recipe.id }, updatedRecipe, { returnDocument: 'after' });

    return makeResponse.success(res, 200, 'Image uploaded successfully', updatedRecipe);
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when uploading an image', 500));
  }
};

const getImage = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);
    const filePath = path.resolve(__dirname, `../images/${recipe.image}`);
    res.setHeader('Content-Type', 'image/*');
    return res.sendFile(filePath);
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when fetching an image', 500));
  }
};

const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);

    await recipe.delete();

    return makeResponse.success(res, 200, 'Recipe deleted successfully');
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when deleting recipe from database', 500));
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
    return makeResponse.error(res, new APIError('Internal server error when updating recipe in database', 500));
  }
};

const recipeController = {
  addRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  uploadImage,
  deleteRecipe,
  publishRecipe,
  getImage,
};

export default recipeController;
