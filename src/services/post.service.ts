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
      nb_roommate: Number(data.nb_roommate),
      postal_code: Number(data.postal_code),
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

// get post by id
const getPostById = async (postId: number): Promise<ApiResponse> => {
  try {
    const post: Post | null = await postQueries.getPostById(postId);
    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, `Post with id ${postId} not found`);
    }

    return new ApiResponse(httpStatus.OK, post, `Post with id ${postId}`);
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
// delete post
const deletePost = async (postId: number): Promise<void> => {
  try {
    // first, get the post by its ID to ensure it exists
    const postToDelete = await postQueries.getPostById(postId);

    if (!postToDelete) {
      throw new ApiError(httpStatus.NOT_FOUND, `Post with id ${postId} not found`);
    }

    // delete any associated files first
    await postQueries.deletePost(postId);
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
// delete files associated with post
const deleteFiles = async (postId: number): Promise<void> => {
  try {
    await fileQueries.deleteFilesByPostId(postId);
  } catch (e) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
};
export { createPost, getPosts, getPostById, deletePost, deleteFiles };
