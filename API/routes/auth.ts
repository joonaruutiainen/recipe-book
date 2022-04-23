import express, { Router } from 'express';
import authController from '../controllers/auth';
import auth from '../middleware/auth';

const authRouter: Router = express.Router();

authRouter.post('/login', authController.loginUser);

authRouter.post('/logout', auth.loginRequired, authController.logoutUser);

authRouter.post('/register', authController.registerUser);

export default authRouter;
