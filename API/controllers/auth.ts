import { Request, Response } from 'express';

const loginUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'POST /login',
  });
};

const registerUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'POST /register',
  });
};

const authController = {
  loginUser,
  registerUser,
};

export default authController;
