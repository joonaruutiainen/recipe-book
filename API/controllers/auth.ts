import { Request, Response } from 'express';
import User from '../models/user';
import APIValidationError from '../models/apiValidationError';
import makeResponse from '../utils/responseHandler';

const loginUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'POST /login',
  });
};

const registerUser = async (req: Request, res: Response) => {
  try {
    await User.validateUserData(req.body);
  } catch (err) {
    if (err instanceof APIValidationError) {
      return makeResponse.error(res, err);
    }
  }

  const { name, email, password } = req.body;

  const user = new User({
    name,
    email,
    password,
  });

  await user.save();

  return makeResponse.success(res, 200, 'User registered successfully', user.toJSON());
};

const authController = {
  loginUser,
  registerUser,
};

export default authController;
