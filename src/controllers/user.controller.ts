import { User } from '@prisma/client';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import * as userService from '../services/user.service';
import ApiError from '../errors/ApiError';

import { Request } from '../types/types';
const editUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const data: User = req.body;
    console.log('data', req.body);
    const updatedUser = await userService.editUser(userId, data);

    res.status(httpStatus.OK).send(updatedUser);
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allUsers = await userService.getAllUsers();

    res.status(httpStatus.OK).send(allUsers);
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Number(req.params.id);

    res.status(httpStatus.OK).send(await userService.getUserById(userId));
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
export { editUser, getAllUsers, getUserById };
