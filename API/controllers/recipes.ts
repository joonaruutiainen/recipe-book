import { Request, Response } from 'express';

const getRecipes = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'GET /recipes',
  });
};

const addRecipe = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'POST /recipes',
  });
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
