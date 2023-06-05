import { User } from '@prisma/client';
// queries
import * as userQueries from '../queries/user.queries';
import * as postQueries from '../queries/post.queries';

import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { universities } from '../config/addresses_universities';
import { geocodeAddress, getUniversityAddress } from './geocode.service';
import { GetPostsParams } from '../types/post/post.types';
import { splitAddress } from '../utils/splitAddress';

// ______________________________________________________________ *** Edit user ***___________________________________________________________

const editUser = async (userId: number, user: User) => {
  try {
    const userToUpdate = await userQueries.getUserById(userId);

    if (!userToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, `User with id ${userId} not found`);
    }

    if (userToUpdate.role === 'STUDENT' && user.university) {
      const universityAddress = await getUniversityAddress(user.university);

      if (!universityAddress) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid university selected');
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
    return updatedInfoUser;
  } catch (e) {
    console.log(e);

    throw new ApiError(e.statusCode, e.message);
  }
};

// ______________________________________________________________ *** Delete user by id ***___________________________________________________________

const deleteUserById = async (userId: number) => {
  try {
    const userToDelete = await userQueries.getUserById(userId);

    if (!userToDelete) {
      throw new ApiError(httpStatus.NOT_FOUND, `User with id ${userId} not found`);
    }
    const posts = await postQueries.getDataPosts();
    posts.posts.map(async (post) => {
      if (post.posterId === userId) await postQueries.deletePost(post.id);
    });
    return await userQueries.deleteUserById(userId);
  } catch (e) {
    console.log(e);

    throw new ApiError(e.statusCode, e.message);
  }
};

// ______________________________________________________________ *** Get all users ***___________________________________________________________

const getAllUsers = async (filterFields: GetPostsParams) => {
  try {
    console.log('filterFields service', filterFields);

    const users = await userQueries.getAllUsers(filterFields);
    const nbPages = Math.ceil(users.length / filterFields.rowsPerPage);
    const nbUsers = await userQueries.getNumberUsers();
    return { users, nbPages, nbUsers, currentPage: Number(filterFields.page) };
  } catch (e) {
    console.log(e);
  }
};

// ______________________________________________________________ *** Get user by id ***___________________________________________________________

const getUserById = async (userId: number) => {
  const user = await userQueries.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with id ${userId} not found`);
  }
  return user;
};

export { editUser, getAllUsers, getUserById, deleteUserById };
