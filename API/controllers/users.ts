import { Request, Response } from 'express';
import { Error as DBError } from 'mongoose';
import User from '../models/user';
import APIError from '../models/apiError';
import makeResponse from '../utils/responseHandler';
import { validateRecipeId } from './recipes';
import loadUserFromRequest from '../utils/loadUser';

const validateUserId = async (req: Request) => {
  const { userId } = req.params;
  if (!userId) return Promise.reject(new APIError('Missing route paramater: userId', 400));

  let user;
  try {
    user = await User.findById(userId).exec();
  } catch (err) {
    if (err instanceof DBError.CastError) return Promise.reject(new APIError('Invalid userId', 400));
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
    `${users.length} users fetched successfully`,
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
    const { name, email, password, newPassword } = req.body;

    if (name) {
      await User.validateUserName(user.id, name);
      user.name = name;
    }

    if (email) {
      await User.validateUserEmail(user.id, email);
      user.email = email;
    }

    if (password && newPassword) {
      await user.verifyPassword(password);
      await User.validateUserPassword(newPassword);
      user.password = newPassword;
    }

    await user.save();

    return makeResponse.success(res, 200, 'User updated successfully', user);
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Interal server error when updating user in database', 500));
  }
};

const updateUserFavorites = async (req: Request, res: Response) => {
  try {
    const recipe = await validateRecipeId(req);

    const { user, error } = await loadUserFromRequest(req);
    if (error) throw new APIError(error, 500);

    const { add, remove } = req.body;

    if (!add && !remove) throw new APIError('Missing required fields', 400);

    if (!user) throw new APIError('User not found', 404);

    if (add) user.favorites = user.favorites.concat(recipe.id);
    else user.favorites = user.favorites.filter(r => r !== recipe.id);

    await user.save();

    return makeResponse.success(res, 200, 'Recipe added to user favorites', user);
  } catch (err) {
    if (err instanceof APIError) return makeResponse.error(res, err);
    return makeResponse.error(res, new APIError('Internal server error when adding recipe to user favorites', 500));
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
  updateUserFavorites,
  deleteUser,
};

export default userController;
