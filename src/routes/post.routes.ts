import express from 'express';
import { Endpoints } from '../config/endpoints';
import { validate } from '../middlewares/validate.middleware';
import { PostController } from '../controllers';

import { postSchema } from '../Schemas/post';
import { postMiddleware } from '..//middlewares/post.validate.middelware';
import upload from '../middlewares/multer';

const postRouter = express.Router();

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *       200:
 *         description: Post created successfully!
 */

postRouter.post(
  Endpoints.post.CREATE,
  upload.array('files'),

  postMiddleware,
  PostController.createPost,
);

/**
 * @swagger
 * /:
 *   posts:
 *     summary: Get list of posts
 *     description: Get list of posts
 *       200:
 *         description: list of posts
 */

postRouter.get(Endpoints.ROOT, PostController.getPosts);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Get post
 *     description: Get single post
 *       200:
 *         description: get post by id
 */

postRouter.get(Endpoints.post.SINGLE, PostController.getPostById);

export default postRouter;
