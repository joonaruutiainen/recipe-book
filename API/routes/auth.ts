import express, { Router } from 'express';
import authController from '../controllers/auth';
import csrfProtection from '../middleware/csrfProtection';
import auth from '../middleware/auth';

const authRouter: Router = express.Router();

authRouter.post('/login', csrfProtection, authController.loginUser);

authRouter.post('/logout', auth.loginRequired, authController.logoutUser);

authRouter.post('/register', csrfProtection, authController.registerUser);

export default authRouter;
