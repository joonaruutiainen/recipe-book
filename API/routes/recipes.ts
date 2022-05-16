import express, { Router } from 'express';
import recipeController from '../controllers/recipes';
import csrfProtection from '../middleware/csrfProtection';
import auth from '../middleware/auth';
import uploadFile from '../middleware/fileUpload';

const recipeRouter: Router = express.Router();

recipeRouter.get('/', recipeController.getRecipes);
recipeRouter.post('/', auth.loginRequired, csrfProtection, recipeController.addRecipe);

recipeRouter.get('/:recipeId/image', auth.recipeRightsRequired, recipeController.getImage);
recipeRouter.get('/:recipeId', auth.recipeRightsRequired, recipeController.getRecipe);
recipeRouter.put('/:recipeId', auth.recipeRightsRequired, csrfProtection, recipeController.updateRecipe);
recipeRouter.delete('/:recipeId', auth.recipeRightsRequired, csrfProtection, recipeController.deleteRecipe);

recipeRouter.post(
  '/:recipeId/uploadImage',
  auth.recipeRightsRequired,
  csrfProtection,
  uploadFile.single('image'),
  recipeController.uploadImage
);
recipeRouter.post('/:recipeId/publish', auth.adminRightsRequired, csrfProtection, recipeController.publishRecipe);

export default recipeRouter;
