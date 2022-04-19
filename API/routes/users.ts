import express, { Router } from 'express';
import userController from '../controllers/users';

const userRouter: Router = express.Router();

userRouter.get('/', userController.getUsers);

userRouter.get('/:userId', userController.getUser);
userRouter.put('/:userId', userController.updateUser);
userRouter.delete('/:userId', userController.deleteUser);

export default userRouter;
