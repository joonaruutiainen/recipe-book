import { Request, Response } from 'express';
import User from '../models/user';
import APIError from '../models/apiError';
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
    if (err instanceof APIError) {
      return makeResponse.error(res, err);
    }
  }

  const user = new User({ ...req.body });

  try {
    await user.save();
  } catch (err) {
    return makeResponse.error(res, new APIError('Internal server error when saving user to database', 500));
  }

  return makeResponse.success(res, 200, 'User registered successfully', user.toJSON());
};

const authController = {
  loginUser,
  registerUser,
};

export default authController;
