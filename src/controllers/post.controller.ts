import { Post } from '@prisma/client';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import * as postService from '../services/post.service';
import ApiError from '../errors/ApiError';
import { postSchema } from '../Schemas/post/post.validation';
import { Filter } from '../types/post/post.types';
import { Request } from '../types/types';

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
// get posts

const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, rowsPerPage, filter } = req.query;

    res.status(200).send(
      await postService.getPosts({
        page: Number(page),
        rowsPerPage: Number(rowsPerPage),
        filter: filter as Filter,
      }),
    );
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

// get posts by owner
const getPostsByOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const rowsPerPage = Number(req.query.rowsPerPage) || 9;
    const title = req.query.title as string;

    const idOwner = Number(req.userId);

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

// get post by id
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
export {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  editPost,
  getPostsByOwner,
  deleteFiles,
  addPostToFavorite,
  getFavoriteList,
  deletePostFromFavoris,
};
