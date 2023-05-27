import { User } from '@prisma/client';
// queries
import * as userQueries from '../queries/user.queries';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { universities } from '../config/addresses_universities';
import { getUniversityAddress } from './geocode.service';

const editUser = async (userId: number, user: User) => {
  try {
    const userToUpdate = await userQueries.getUserById(userId);

    if (!userToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, `User with id ${userId} not found`);
    }
    if (user.university) {
      // Retrieve the address of the university from your backend or database
      const universityAddress = await getUniversityAddress(user.university);

      if (!universityAddress) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid university selected');
        console.log('Invalid university selected');
      }

      user.universityAddress = universityAddress;
    }
    if (user.email !== userToUpdate.email) {
      const existingUser = await userQueries.getUserByEmail(user.email);
      if (existingUser) {
        throw new ApiError(409, 'User already exits with this email');
      }
    }

    const updatedInfoUser = await userQueries.updateUser(userId, user);
    console.log('updatedInfoUser', updatedInfoUser);

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
