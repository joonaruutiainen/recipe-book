import express, { Router } from 'express';
import recipeController from '../controllers/recipes';
import csrfProtection from '../middleware/csrfProtection';
import auth from '../middleware/auth';

const recipeRouter: Router = express.Router();

recipeRouter.get('/', recipeController.getRecipes);
recipeRouter.post('/', auth.loginRequired, csrfProtection, recipeController.addRecipe);

recipeRouter.get('/:recipeId', auth.recipeRightsRequired, recipeController.getRecipe);
recipeRouter.put('/:recipeId', auth.recipeRightsRequired, csrfProtection, recipeController.updateRecipe);
recipeRouter.delete('/:recipeId', auth.recipeRightsRequired, csrfProtection, recipeController.deleteRecipe);

recipeRouter.post('/:recipeId/publish', auth.adminRightsRequired, csrfProtection, recipeController.publishRecipe);

export default recipeRouter;
