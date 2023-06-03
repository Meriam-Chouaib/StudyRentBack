import { User } from '@prisma/client';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import * as userService from '../services/user.service';
import ApiError from '../errors/ApiError';

import { Request } from '../types/types';
import { Filter, GetPostsParams } from '../types/post/post.types';
import { GetUsersParams } from '../types/user/user.types';

// ___________________________________________ Edit user ________________________________________________________

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

// ___________________________________________ Get All Users ________________________________________________________

const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, rowsPerPage, search, role } = req.query;
    let filterFields: GetUsersParams = {
      page: Number(page),
      rowsPerPage: Number(rowsPerPage),
      role: role as string,
    };
    if (search) filterFields = { ...filterFields, search: search as string };
    console.log('controller filterFields', filterFields);

    const allUsers = await userService.getAllUsers(filterFields);
    // console.log(allUsers);

    res.status(httpStatus.OK).send(allUsers);
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

// ___________________________________________ Get user by id ________________________________________________________

const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Number(req.params.id);

    res.status(httpStatus.OK).send(await userService.getUserById(userId));
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

// ___________________________________________ Delete user ________________________________________________________

const deleteUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Number(req.params.id);

    res.status(httpStatus.OK).send(await userService.deleteUserById(userId));
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
export { editUser, getAllUsers, getUserById, deleteUserById };
