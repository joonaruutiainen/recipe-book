import { Request, Response } from 'express';
import config from 'config';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import APIError from '../models/apiError';
import makeResponse from '../utils/responseHandler';

const loginUser = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password)
    return makeResponse.error(res, new APIError('User identifier and password required', 400));
  try {
    let user;
    if (identifier.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      user = await User.findOne({ email: identifier }).exec();
    }
    if (!user) {
      user = await User.findOne({ name: identifier }).exec();
    }
    if (!user) return makeResponse.error(res, new APIError('User not found', 404));

    await user.verifyPassword(password);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('process.env.JWT_SECRET is undefined');
    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '24h' });
    req.session.token = token;

    return makeResponse.success(res, 200, 'Used logged in successfully', { ...user.toJSON() });
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when authenticating user', 500));
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const { name: sessionName } = config.get('session');
    res.clearCookie('token');
    res.clearCookie(sessionName);
    req.session.destroy(err => {
      if (err) throw new APIError('Failed to logout user', 500);
      return 'success';
    });
    return makeResponse.success(res, 200, 'User logged out successfully');
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when clearing session data', 500));
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    await User.validateUserData(req.body);
    const user = new User({ ...req.body });
    await user.save();
    return makeResponse.success(res, 201, 'User registered successfully', user.toJSON());
  } catch (err) {
    if (err instanceof APIError) {
      return makeResponse.error(res, err);
    }
    return makeResponse.error(res, new APIError('Internal server error when saving user to database', 500));
  }
};

const authController = {
  loginUser,
  logoutUser,
  registerUser,
};

export default authController;
