import { Request, Response } from 'express';

const getUsers = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'GET /users',
  });
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
