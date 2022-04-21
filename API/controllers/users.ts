import { Request, Response } from 'express';
import { Error as DBError } from 'mongoose';
import User from '../models/user';
import APIError from '../models/apiError';
import makeResponse from '../utils/responseHandler';

const validateUserId = async (req: Request) => {
  const { userId } = req.params;
  if (!userId) return Promise.reject(new APIError('Missing route paramater: userId', 403));

  let user;
  try {
    user = await User.findById(userId).exec();
  } catch (err) {
    if (err instanceof DBError.CastError) return Promise.reject(new APIError('Invalid userId', 403));
  }

  if (!user) return Promise.reject(new APIError(`No user found with ID ${userId}`, 404));
  return Promise.resolve(user);
};

const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  if (!users) return makeResponse.error(res, new APIError('"Users" not found', 404));

  return makeResponse.success(
    res,
    200,
    `${users.length} recipes fetched successfully`,
    users.map(r => r.toJSON())
  );
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await validateUserId(req);
    return makeResponse.success(res, 200, 'User fetched successfully', user.toJSON());
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when fetching user from database', 500));
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await validateUserId(req);
    const { name, email, password } = req.body;

    if (name) {
      await User.validateUserName(user.id, name);
      user.name = name;
    }

    if (email) {
      await User.validateUserEmail(user.id, email);
      user.email = email;
    }

    if (password) {
      await User.validateUserPassword(password);
      user.password = password;
    }

    await user.save();

    return makeResponse.success(res, 200, 'User updated successfully', user);
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when updating user in database', 500));
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await validateUserId(req);

    await user.delete();

    return makeResponse.success(res, 200, 'User deleted successfully');
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when deleting user from database', 500));
  }
};

const userController = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};

export default userController;
