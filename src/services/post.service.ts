import { Files, Post } from '@prisma/client';
import * as postQueries from '../queries/post.queries';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import * as fileQueries from '../queries/file.queries';
import ApiResponse from '../utils/ApiResponse';

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
    console.log(result);

    return new ApiResponse(httpStatus.OK, result, 'post created successfully!');
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

export { createPost };
