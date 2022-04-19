import express, { Router } from 'express';
import authController from '../controllers/auth';

const authRouter: Router = express.Router();

authRouter.post('/login', authController.loginUser);

authRouter.post('/register', authController.registerUser);

export default authRouter;
