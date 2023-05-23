import { User } from '@prisma/client';
// queries
import * as userQueries from '../queries/user.queries';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

const editUser = async (userId: number, user: User) => {
  try {
    const userToUpdate = await userQueries.getUserById(userId);

    if (!userToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, `User with id ${userId} not found`);
    }
    if (user.email !== userToUpdate.email) {
      const existingUser = await userQueries.getUserByEmail(user.email);
      if (existingUser) {
        throw new ApiError(409, 'User already exits with this email');
      }
    }

    const updatedInfoUser = await userQueries.updateUser(userId, user);

    return updatedInfoUser;
  } catch (e) {
    console.log(e);

    throw new ApiError(e.statusCode, e.message);
  }
};
const getAllUsers = async () => {
  try {
    return await userQueries.getAllUsers();
  } catch (e) {
    console.log(e);
  }
};
const getUserById = async (userId: number) => {
  const user = await userQueries.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with id ${userId} not found`);
  }

  return user;
};
export { editUser, getAllUsers, getUserById };
