import { Favorite, Files, Post, Prisma, User } from '@prisma/client';
// queries
import * as postQueries from '../queries/post.queries';
import * as userQueries from '../queries/user.queries';
import * as fileQueries from '../queries/file.queries';
import * as userService from '../services/user.service';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

import ApiResponse from '../utils/ApiResponse';
import { Filter, GetFavoriteListParams, GetPostsParams } from '../types/post/post.types';
import { geocodeAddress, geocodeAddresses } from './geocode.service';
import { splitAddress } from '../utils/splitAddress';

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
const getPosts = async (filterFields: GetPostsParams) => {
  try {
    console.log('filterFields', filterFields);
    if (filterFields.universityAddress) {
      const [city] = splitAddress(filterFields.universityAddress);
      filterFields = { ...filterFields, universityAddress: city };
    }

    const posts = await postQueries.getPosts({
      ...filterFields,
    });

    const localizations = await geocodeAddresses(posts);

    const nbPosts = filterFields.universityAddress
      ? posts.length
      : (await postQueries.getTotalPosts(filterFields.filter)).nbPosts;

    const nbPages = Math.ceil(nbPosts / filterFields.rowsPerPage);

    return {
      posts,
      localizations,
      nbPages: Number(nbPages),
      nbPosts,
      currentPage: Number(filterFields.page),
    };
  } catch (e) {
    console.log(e);
  }
};
const getAllListPosts = async () => {
  try {
    const posts = await postQueries.getTotalPosts(undefined);
    return posts;
  } catch (e) {
    console.log(e);
  }
};
// _____________________________________________ get total posts with filter _______________________________
const getTotalPostsFiltred = async (filter: Filter) => {
  try {
    const posts = await postQueries.getTotalPosts(filter);
    return posts;
  } catch (e) {
    console.log(e);
  }
};
// _____________________________________________  get posts by owner  ______________________________________________________________________

const getPostsByOwner = async ({ page, rowsPerPage, filter, idOwner }: GetPostsParams) => {
  try {
    console.log(idOwner);

    const posts = await postQueries.getPostsByOwner({ page, rowsPerPage, filter, idOwner });
    const localizations = await geocodeAddresses(posts);
    const nbPosts = await postQueries.getTotalPostsByOwner(filter, idOwner);

    const nbPages = Math.ceil(nbPosts / rowsPerPage);

    return new ApiResponse(
      httpStatus.OK,
      { posts, localizations, nbPages: Number(nbPages), nbPosts, currentPage: Number(page) },
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
    const owner: User = await userQueries.getUserById(post.posterId);
    const localization = await geocodeAddress(post.state, post?.postal_code, post?.city);
    return new ApiResponse(httpStatus.OK, { post, localization, owner }, `Post with id ${postId}`);
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
    const localization = await geocodeAddress(data.state, data.postal_code, data.city);

    return {
      status: 200,
      data: { post: updatedInfoPost, localization: localization },
      message: 'test update post',
    };
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

    const nbPosts = await postQueries.getTotalListFavorite(userId);

    const nbPages = Math.ceil(nbPosts / rowsPerPage);
    if (listFavorites) {
      await Promise.all(
        listFavorites.map(async (favorit: Favorite) => {
          const post = await postQueries.getPostById(Number(favorit.postId));
          if (post !== null) {
            posts.push(post);
          }
        }),
      );
    }

    return new ApiResponse(
      httpStatus.OK,
      { posts, localizations: posts ? await geocodeAddresses(posts) : [], nbPages: nbPages },
      'List of posts',
    );
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

const getMinimalPostPrice = async (): Promise<ApiResponse> => {
  try {
    return new ApiResponse(httpStatus.OK, await postQueries.getMinimalPostPrice(), 'min price');
  } catch (e) {
    console.log(e);
    throw new ApiError(e.statusCode, e.message);
  }
};
const getMaximalPostPrice = async (): Promise<ApiResponse> => {
  try {
    return new ApiResponse(httpStatus.OK, await postQueries.getMaximalPostPrice(), 'List of posts');
  } catch (e) {
    console.log(e);
    throw new ApiError(e.statusCode, e.message);
  }
};
const getMinimalPostSurface = async (): Promise<ApiResponse> => {
  try {
    return new ApiResponse(
      httpStatus.OK,
      await postQueries.getMinimalPostSurface(),
      'Minimal post surface',
    );
  } catch (e) {
    console.log(e);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve minimal post surface');
  }
};

const getMaximalPostSurface = async (): Promise<ApiResponse> => {
  try {
    return new ApiResponse(
      httpStatus.OK,
      await postQueries.getMaximalPostSurface(),
      'Maximal post surface',
    );
  } catch (e) {
    console.log(e);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve maximal post surface');
  }
};

export {
  getMaximalPostSurface,
  getMinimalPostSurface,
  getMaximalPostPrice,
  getMinimalPostPrice,
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
  getAllListPosts,
  getTotalPostsFiltred,
};
