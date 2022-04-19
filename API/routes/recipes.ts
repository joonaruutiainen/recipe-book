import express, { Router } from 'express';
import recipeController from '../controllers/recipes';

const recipeRouter: Router = express.Router();

recipeRouter.get('/', recipeController.getRecipes);
recipeRouter.post('/', recipeController.addRecipe);

recipeRouter.get('/:recipeId', recipeController.getRecipe);
recipeRouter.put('/:recipeId', recipeController.updateRecipe);
recipeRouter.delete('/:recipeId', recipeController.deleteRecipe);

recipeRouter.post('/:recipeId/publish', recipeController.publishRecipe);

export default recipeRouter;
