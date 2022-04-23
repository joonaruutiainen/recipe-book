import express, { Router } from 'express';
import recipeController from '../controllers/recipes';
import auth from '../middleware/auth';

const recipeRouter: Router = express.Router();

recipeRouter.get('/', recipeController.getRecipes);
recipeRouter.post('/', auth.loginRequired, recipeController.addRecipe);

recipeRouter.get('/:recipeId', auth.recipeRightsRequired, recipeController.getRecipe);
recipeRouter.put('/:recipeId', auth.recipeRightsRequired, recipeController.updateRecipe);
recipeRouter.delete('/:recipeId', auth.recipeRightsRequired, recipeController.deleteRecipe);

recipeRouter.post('/:recipeId/publish', auth.adminRightsRequired, recipeController.publishRecipe);

export default recipeRouter;
