import { Files, Post } from '@prisma/client';
import * as postQueries from '../queries/post.queries';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import * as fileQueries from '../queries/file.queries';
import ApiResponse from '../utils/ApiResponse';
import { GetPostsParams } from '../types/post/post.types';

// create post
const createPost = async (data: Post, fileData: Files[]) => {
  try {
    const post = await postQueries.createPost({
      nbRoommate: Number(data.nbRoommate),
      ...data,
    });
    const fileCreated = await Promise.all(
      fileData?.map((file: Files) => {
        const files = fileQueries.createFiles({
          filename: file.filename,
          postId: post.id,
        });
        return files;
      }),
    );
    const result = {
      ...post,
      files: fileCreated,
    };

    if (post && fileCreated) {
      return result;
    }
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

//get posts
const getPosts = async ({ page, rowsPerPage, filter }: GetPostsParams) => {
  try {
    const result = await postQueries.getPosts({ page, rowsPerPage, filter });
    return new ApiResponse(httpStatus.OK, result, 'List of posts');
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

export { createPost, getPosts };
