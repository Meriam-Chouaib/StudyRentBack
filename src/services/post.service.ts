import { Post } from '@prisma/client';
import * as postQueries from '../queries/post.queries';
import * as userQueries from '../queries/user.queries';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import * as MESSAGES from '../utils/globals';

const createPost = async (data: Post) => {
  // if (await userQueries.getUserById(data.posterId)) {
  //   throw new ApiError(httpStatus.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
  // }
  return await postQueries.createPost({ ...data });
};

export { createPost };
