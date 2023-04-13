import express from 'express';
import { Endpoints } from '../config/endpoints';
import { validate } from '../middlewares/validate.middleware';
import { PostController } from '../controllers';

import { postSchema } from '../Schemas/post';
import { postMiddleware, MiddlewarePost } from '..//middlewares/post.validate.middelware';
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
  MiddlewarePost,
  // postMiddleware,
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
 *   posts:
 *     summary: Get list of posts by owner
 *     description: Get list of posts by owner
 *       200:
 *         description: list of posts by owner
 */

postRouter.get(Endpoints.post.LIST, PostController.getPostsByOwner);
/**
 * @swagger
 * /:
 *   posts:
 *     summary: Get list of posts
 *     description: Get list of posts
 *       200:
 *         description: list of posts
 */

postRouter.get(Endpoints.post.SINGLE, PostController.getPostById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: delete post
 *     description: delete post
 *       200:
 *         description: post deleted successfully!
 */

postRouter.delete(Endpoints.post.SINGLE, PostController.deletePost);
postRouter.patch(Endpoints.post.SINGLE, PostController.editPost);

export default postRouter;
