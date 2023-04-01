import { error } from './../logger/logger';
import { Files, Post, Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Logger } from '../logger';
import * as postService from '../services/post.service';
import ApiError from '../errors/ApiError';
import { postSchema } from '../Schemas/post/post.validation';
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
    const data: Post = req.body as Post;

    const { value, error } = postSchema.validate(req.body);

    const post = await postService.createPost(value, filesData as unknown as Files[]);
    res.status(httpStatus.OK).send(post);
    // throw new ApiResponse(httpStatus.OK, post, 'success');
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

// get posts

const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const rowsPerPage = Number(req.query.rowsPerPage) || 9;
    const title = req.query.title as string;
    const filter: Prisma.PostWhereInput = {
      title: {
        contains: title,
      },
    };

    res
      .status(200)
      .send(await postService.getPosts({ page: page, filter: filter, rowsPerPage: rowsPerPage }));
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

export { createPost, getPosts };
