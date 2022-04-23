import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import APIError from '../models/apiError';
import makeResponse from '../utils/responseHandler';
import User from '../models/user';
import Recipe from '../models/recipe';

const authenticateUser = async (req: Request) => {
  const baseErrorMsg = 'User authentication failed:';
  try {
    const { token } = req.session;
    if (!token) throw new APIError(`${baseErrorMsg} Missing session token`, 401);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('process.env.JWT_SECRET is undefined');

    const { sub } = jwt.verify(token, secret);
    if (!sub) throw new JsonWebTokenError(`${baseErrorMsg} Invalid token, subject is required`);

    const user = await User.findById(sub).exec();
    if (!user) throw new APIError(`${baseErrorMsg} User not found`, 401);
    return await Promise.resolve(user);
  } catch (err) {
    if (err instanceof APIError) return Promise.reject(err);
    if (err instanceof TokenExpiredError)
      return Promise.reject(new APIError(`${baseErrorMsg} Authentication token expired`, 401));
    if (err instanceof JsonWebTokenError || err instanceof SyntaxError)
      return Promise.reject(new APIError(`${baseErrorMsg} ${err.message}`, 401));
    return Promise.reject(new APIError('Internal server error when authenticating user', 500));
  }
};

const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authenticateUser(req);
    return next();
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Login required', 401));
  }
};

const adminRightsRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authenticateUser(req);
    if (user?.admin) return next();
    return makeResponse.error(res, new APIError('Admin rights required', 403));
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Admin rights required', 403));
  }
};

const userRightsRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authenticateUser(req);
    if (user?.id === req.params.userId || user?.admin) return next();
    return makeResponse.error(res, new APIError('User rights required', 403));
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('User rights required', 403));
  }
};

const recipeRightsRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).exec();
    if (recipe?.public) return next();
    const user = await authenticateUser(req);
    if (user?.id === recipe?.userId || user?.admin) return next();
    return makeResponse.error(res, new APIError('Recipe rights required', 403));
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Recipe rights required', 403));
  }
};

const auth = {
  loginRequired,
  adminRightsRequired,
  userRightsRequired,
  recipeRightsRequired,
};

export default auth;
