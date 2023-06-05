import { Post } from '@prisma/client';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import * as postService from '../services/post.service';
import ApiError from '../errors/ApiError';
import { postSchema } from '../Schemas/post/post.validation';
import { Filter, GetPostsParams } from '../types/post/post.types';
import { Request } from '../types/types';
import * as geoCodeService from '../services/geocode.service';
import * as userService from '../services/user.service';
import ApiResponse from '../utils/ApiResponse';

//------------------------- create post --------------------------------------
/**
 * create post
 * @param req
 * @param res
 * @param next
 */

// create post

const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filesData = req.files as Express.Multer.File[];
    const data: Post = Object.assign({} as Post, JSON.parse(req.body.post));

    const { value, error } = postSchema.validate(data);
    data.posterId = req.userId;
    const post = await postService.createPost(data, filesData);
    res.status(httpStatus.OK).send(post);
  } catch (e) {
    next(e);
  }
};
// ____________________________________get posts_______________________

const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, rowsPerPage, filter, universityAddress, idOwner } = req.query;

    let filterFields: GetPostsParams = {
      page: Number(page),
      rowsPerPage: Number(rowsPerPage),
      // filter: filter as Filter,
    };
    console.log('filterFields controller', filterFields);

    if (filter) {
      console.log('filter', filter);
      filterFields = { ...filterFields, filter: filter as Filter };
    }

    if (universityAddress) {
      filterFields = { ...filterFields, universityAddress: universityAddress as string };
    }
    if (idOwner) {
      filterFields = { ...filterFields, idOwner: Number(idOwner) };
    }

    const result = await postService.getPosts(filterFields);
    return new ApiResponse(httpStatus.OK, result, 'data received successfully!').send(res);

    // res.status(200).send(result);
  } catch (e) {
    console.log(e);
  }
};
// ____________________________________ getNearestPostsToUniversity_________________________
const getNearestPostsToUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = Number(req.params.id);
  const posts = (await postService.getAllListPosts()).posts;

  const universityAddress = (await userService.getUserById(userId)).universityAddress;
  const postsNearest = await geoCodeService.calculateNearestPostsToUniversity(
    universityAddress,
    posts,
  );
  res.status(200).send(postsNearest);
  console.log('postsNearest', postsNearest);
};

//_____________________________________ get all posts ______________________________________

const getTotalPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { filter } = req.query;

  const posts = await postService.getTotalPostsFiltred(filter as Filter);

  res
    .status(200)
    .send({ data: { posts: posts, message: 'data received successfully', status: httpStatus.OK } });
  console.log('postsNearest', posts);
};
// ____________________________________get posts by owner___________________________________

const getPostsByOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page);
    const rowsPerPage = Number(req.query.rowsPerPage);
    const title = req.query.title as string;

    const idOwner = Number(req.userId);
    console.log('from controller', idOwner);

    const filter: Filter = {
      title: title,
    };

    res.status(200).send(
      await postService.getPostsByOwner({
        page: page,
        filter: filter,
        rowsPerPage: rowsPerPage,
        idOwner: idOwner,
      }),
    );
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

// ____________________________________get post by id_____________________
const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | ApiError> => {
  try {
    const postId = req.params.id;
    const post = await postService.getPostById(Number(postId));

    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }

    res.status(httpStatus.OK).send(post);
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};

// delete post
const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId = req.params.id;
    // get the post by id
    const postToDelete = await postService.getPostById(Number(postId));
    console.log(postToDelete);
    if (!postToDelete) {
      throw new ApiError(httpStatus.NOT_FOUND, `Post with id ${postId} not found`);
    }
    // delete the associated files first
    await postService.deleteFiles(Number(postId));
    // delete the post itself
    await postService.deletePost(Number(postId));
    res.status(httpStatus.OK).send('deletedPost');
    // return new ApiResponse(httpStatus.OK, {}, 'Post deleted successfully!');
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};
const deleteFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId = req.params.id;
    await postService.deleteFiles(Number(postId));
    res.status(httpStatus.OK).send('files deleted successfully');
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};

// edit post
const editPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('req.files', req.files);

    const postId = Number(req.params.id);
    const filesData = (await req.files) as Express.Multer.File[];
    console.log('filesData', filesData);
    const data: Post = Object.assign({} as Post, JSON.parse(req.body.post));
    console.log('data', data);
    const updatedPost = await postService.editPost(postId, data, filesData);

    res.status(httpStatus.OK).send(updatedPost);
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
const addPostToFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = Number(req.params.userId);
  const postId = Number(req.params.postId);

  try {
    const result = await postService.addPostToFavorites(userId, postId);
    res.status(httpStatus.OK).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getFavoriteList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = Number(req.params.id);
  const { page, rowsPerPage } = req.query;

  try {
    res.status(200).send(
      await postService.getListFavorite({
        page: Number(page),
        rowsPerPage: Number(rowsPerPage),
        userId: Number(userId),
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deletePostFromFavoris = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    const postId = Number(req.params.postId);
    await postService.deletePostFromFavoriteList(postId, userId);
    res.status(httpStatus.OK).send('post deleted from favorite list');
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};

// _______________________________________________________________ price max and min______________________________________________________
const getMaximalPostPrice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const maxPrice = await postService.getMaximalPostPrice();
    res.status(httpStatus.OK).send(maxPrice);
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};
const getMinimalPostPrice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.status(httpStatus.OK).send(await postService.getMinimalPostPrice());
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};
const getMinimalPostSurface = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const minSurface = await postService.getMinimalPostSurface();
    res.status(httpStatus.OK).send(minSurface);
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};
const getMaximalPostSurface = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const maxSurface = await postService.getMaximalPostSurface();
    res.status(httpStatus.OK).send(maxSurface);
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};

export {
  createPost,
  getPosts,
  getPostById,
  getMaximalPostPrice,
  getMinimalPostPrice,
  getMinimalPostSurface,
  getMaximalPostSurface,
  deletePost,
  editPost,
  getPostsByOwner,
  deleteFiles,
  addPostToFavorite,
  getFavoriteList,
  deletePostFromFavoris,
  getNearestPostsToUniversity,
  getTotalPosts,
};
