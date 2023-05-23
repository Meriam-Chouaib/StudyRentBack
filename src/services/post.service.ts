import { Favorite, Files, Post } from '@prisma/client';
// queries
import * as postQueries from '../queries/post.queries';
import * as userQueries from '../queries/user.queries';
import * as fileQueries from '../queries/file.queries';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

import ApiResponse from '../utils/ApiResponse';
import { Filter, GetFavoriteListParams, GetPostsParams } from '../types/post/post.types';
import { geocodeAddress, geocodeAddresses } from './geocodeService';

// create post
const createPost = async (data: Post, fileData: Express.Multer.File[]) => {
  try {
    const post = await postQueries.createPost(
      {
        nb_roommate: Number(data.nb_roommate),
        city: data.city,
        price: data.price,
        ...data,
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
    const posts = await postQueries.getPosts({
      page,
      rowsPerPage,
      filter,
    });
    const localizations = await geocodeAddresses(posts);

    return new ApiResponse(httpStatus.OK, { posts, localizations }, 'List of posts');
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

// _____________________________________________  get posts by owner  ______________________________________________________________________

const getPostsByOwner = async ({ page, rowsPerPage, filter, idOwner }: GetPostsParams) => {
  try {
    const posts = await postQueries.getPostsByOwner({ page, rowsPerPage, filter, idOwner });
    const localizations = await geocodeAddresses(posts);

    return new ApiResponse(
      httpStatus.OK,
      { posts, localizations },
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
    const localization = await geocodeAddress(post.state, post?.postal_code, post?.city);
    return new ApiResponse(httpStatus.OK, { post, localization }, `Post with id ${postId}`);
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
  try {
    // get the post to update
    console.log('fileData', fileData);
    console.log('Data', data);

    const postToUpdate = await postQueries.getPostById(postId);

    if (!postToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, `Post with id ${postId} not found`);
    }

    const updatedInfoPost = await postQueries.editPost(
      postId,
      {
        nb_roommate: Number(data.nb_roommate),
        city: data.city,
        price: data.price,
        ...data,
      },
      fileData,
    );

    return updatedInfoPost;
  } catch (e) {
    console.log(e);

    throw new ApiError(e.statusCode, e.message);
  }
};
const addPostToFavorites = async (userId: number, postId: number): Promise<Post> => {
  try {
    const post = await postQueries.getPostById(postId);
    if (!post) {
      throw new ApiError(404, `Post with ID ${postId} not found.`);
    }
    const listFavorite = await getListFavorite({ userId: userId });

    if (
      listFavorite &&
      listFavorite.data &&
      Array.isArray(listFavorite.data.posts) &&
      listFavorite.data.posts.findIndex((item) => item.id === post.id) !== -1
    ) {
      throw new ApiError(409, `Post with ID ${postId} already exists in the favorite list.`);
    }
    return await postQueries.addPostToFavorite(userId, postId);
  } catch (e) {
    console.log(e);

    throw new ApiError(e.statusCode, e.message);
  }
};
const getListFavorite = async ({ page, rowsPerPage, userId }: GetFavoriteListParams) => {
  try {
    console.log('user idd', userId);

    const posts: Post[] = [];
    const listFavorites: Favorite[] = await postQueries.getListFavorite({
      page,
      rowsPerPage,
      userId,
    });
    console.log(listFavorites);
    // return favorites;

    await Promise.all(
      listFavorites.map(async (favorit: Favorite) => {
        const post = await postQueries.getPostById(Number(favorit.postId));
        posts.push(post);
      }),
    );
    const localizations = await geocodeAddresses(posts);
    return new ApiResponse(httpStatus.OK, { posts, localizations }, 'List of posts');
  } catch (e) {
    console.log(e);

    throw new ApiError(e.statusCode, e.message);
  }
};
// delete post
const deletePostFromFavoriteList = async (postId: number, userId: number): Promise<void> => {
  try {
    const posts = await postQueries.getListFavorite({ userId: userId });
    posts.map(async (item) => {
      if (item.postId == postId) {
        await postQueries.deletePostFromFavorisList(item.id);
      }
    });
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
export {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  deleteFiles,
  editPost,
  getPostsByOwner,
  addPostToFavorites,
  getListFavorite,
  deletePostFromFavoriteList,
};
