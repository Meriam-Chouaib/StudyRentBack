import { Files, Post } from '@prisma/client';
// queries
import * as postQueries from '../queries/post.queries';
import * as userQueries from '../queries/user.queries';
import * as fileQueries from '../queries/file.queries';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

import ApiResponse from '../utils/ApiResponse';
import { Filter, GetPostsParams } from '../types/post/post.types';

// create post
// const createPost = async (data: Post, fileData: Express.Multer.File[]) => {
//   try {
//     // images
//     const postImages: Files[] = fileData.map((file: Express.Multer.File) => {
//       return {
//         id: undefined,
//         postId: undefined,
//         filename: file.filename,
//         path: file.path,
//       };
//     });

//     const dataWithFiles = {
//       ...data,
//       nb_rooms: Number(data.nb_rooms),
//       nb_roommate: Number(data.nb_roommate),
//       surface: Number(data.surface),
//       posterId: Number(data.posterId),
//       poster: userQueries.getUserById(Number(data.posterId)),
//       files: postImages,
//     };
//     console.log('dataWithFiles', dataWithFiles);

//     const post = await postQueries.createPost(
//       {
//         ...dataWithFiles,
//       },
//       fileData,
//     );
//     return post;
//   } catch (e) {
//     throw new ApiError(e.statusCode, e.message);
//   }
// };

// create post
const createPost = async (data: Post, fileData: Express.Multer.File[]) => {
  try {
    // images
    const postImages: Files[] = fileData.map((file: Express.Multer.File) => {
      return {
        id: undefined,
        postId: undefined,
        filename: file.filename,
        path: file.path,
      };
    });

    const dataWithFiles = {
      ...data,

      files: postImages,
    };
    console.log('dataWithFiles', dataWithFiles);

    const post = await postQueries.createPost(
      {
        nb_roommate: Number(data.nb_roommate),
        ...dataWithFiles,
      },
      fileData,
    );
    return post;
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

// _____________________________________________  get posts with filter  ______________________________________________________________________
const getPosts = async ({ page, rowsPerPage, filter }: GetPostsParams) => {
  try {
    const result = await postQueries.getPosts({
      page,
      rowsPerPage,
      filter,
    });

    return new ApiResponse(httpStatus.OK, result, 'List of posts');
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
// const getPosts = async ({ page, rowsPerPage, filter }: GetPostsParams) => {
//   try {
//     let filterData = {};

//     if (filter) {
//       let filterData: Filter = JSON.parse(filter.toString());
//       const { city, nb_rooms, surface, title, price } = filterData;
//       filter = { ...filter, price, surface, city, nb_rooms, title };
//     }
//     const result = await postQueries.getPosts({
//       page,
//       rowsPerPage,
//       filter: filterData,
//     });

//     return new ApiResponse(httpStatus.OK, result, 'List of posts');
//   } catch (e) {
//     throw new ApiError(e.statusCode, e.message);
//   }
// };

// _____________________________________________  get posts by owner  ______________________________________________________________________

const getPostsByOwner = async ({ page, rowsPerPage, filter, idOwner }: GetPostsParams) => {
  try {
    const result = await postQueries.getPostsByOwner({ page, rowsPerPage, filter, idOwner });
    return new ApiResponse(
      httpStatus.OK,
      result,
      'List of posts for the owner with id: ' + idOwner,
    );
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
// _____________________________________________  get post by id  ______________________________________________________________________

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
// _____________________________________________  delete post by id  ______________________________________________________________________

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
// edit post
const editPost = async (postId: number, data: Post, fileData: Express.Multer.File[]) => {
  console.log(
    'from service postId',
    postId,
    'from service data',
    data,
    'from service fileData',
    fileData,
  );

  try {
    const postImages: Files[] = fileData.map((file: Express.Multer.File, index) => {
      return {
        id: index,
        postId: postId,
        filename: file.filename,
        path: file.path,
      };
    });

    // get the post to update
    const postToUpdate = await postQueries.getPostById(postId);

    if (!postToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, `Post with id ${postId} not found`);
    }
    // update the post's data
    const dataWithFiles = {
      ...data,

      files: postImages,
    };
    const updatedPost = await postQueries.editPost(
      postId,
      { ...dataWithFiles, postal_code: dataWithFiles.postal_code.toString() },
      fileData,
    );

    //   console.log('dataWithFiles', dataWithFiles);

    return updatedPost;
  } catch (e) {
    console.log(e);

    throw new ApiError(e.statusCode, e.message);
  }
};
export { createPost, getPosts, getPostById, deletePost, deleteFiles, editPost, getPostsByOwner };
