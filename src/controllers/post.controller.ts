import { error } from './../logger/logger';
import { Files, Post } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Logger } from '../logger';
import * as postService from '../services/post.service';
import ApiError from '../errors/ApiError';
import { postSchema } from '../Schemas/post/post.validation';
//------------------------- create post --------------------------------------
/**
 * create post
 * @param req
 * @param res
 * @param next
 */

const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filesData = req.files as Express.Multer.File[];
    const data: Post = req.body as Post;

    const { value, error } = postSchema.validate(req.body);

    const post = await postService.createPost(value, filesData as unknown as Files[]);
    res.status(httpStatus.OK).send(post);
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

export { createPost };
