import express, { Router } from 'express';
import userController from '../controllers/users';
import auth from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.get('/', auth.adminRightsRequired, userController.getUsers);

userRouter.get('/:userId', auth.userRightsRequired, userController.getUser);
userRouter.put('/:userId', auth.userRightsRequired, userController.updateUser);
userRouter.delete('/:userId', auth.userRightsRequired, userController.deleteUser);

export default userRouter;
