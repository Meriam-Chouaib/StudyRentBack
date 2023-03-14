import { Post } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Logger } from '../logger';
import * as postService from '../services/post.service';

//------------------------- create post --------------------------------------
/**
 * create post
 * @param req
 * @param res
 * @param next
 */

const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: Post = req.body as Post;
    const post = await postService.createPost(data);
    res.status(httpStatus.OK).send(post);
  } catch (err) {
    Logger.error(err, 'PostController');
    next(err);
  }
};

export { createPost };
