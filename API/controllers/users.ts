import { Request, Response } from 'express';
import User from '../models/user';
import makeResponse from '../utils/responseHandler';

const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  return makeResponse.success(
    res,
    200,
    undefined,
    users.map(u => u.toJSON())
  );
};

const getUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: `GET /users/${req.params.userId}`,
  });
};

const updateUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: `PUT /users/${req.params.userId}`,
  });
};

const deleteUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: `DELETE /users/${req.params.userId}`,
  });
};

const userController = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};

export default userController;
