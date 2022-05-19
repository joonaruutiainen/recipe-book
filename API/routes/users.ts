import express, { Router } from 'express';
import userController from '../controllers/users';
import csrfProtection from '../middleware/csrfProtection';
import auth from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.get('/', auth.adminRightsRequired, userController.getUsers);

userRouter.get('/:userId', auth.userRightsRequired, userController.getUser);
userRouter.put(
  '/:userId/updateFavorites/:recipeId',
  auth.userRightsRequired,
  csrfProtection,
  userController.updateUserFavorites
);
userRouter.put('/:userId', auth.userRightsRequired, csrfProtection, userController.updateUser);
userRouter.delete('/:userId', auth.userRightsRequired, csrfProtection, userController.deleteUser);

export default userRouter;
