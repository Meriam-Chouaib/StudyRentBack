import express from 'express';
import { Endpoints } from '../config/endpoints';
import { validate } from '../middlewares/validate.middleware';
import { PostController } from '../controllers';

import { postSchema } from '../Schemas/post';
import upload from '../middlewares/multer';
import { verifyToken } from '../middlewares/VerifyToken';
import { isRole } from '../middlewares/AuthoriseRole';

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
  validate(postSchema.postSchema),
  upload.array('files'),
  verifyToken,
  isRole(['ADMIN', 'OWNER']),
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

postRouter.get(Endpoints.post.LIST, verifyToken, PostController.getPostsByOwner);
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
postRouter.patch(Endpoints.post.SINGLE, upload.array('files'), PostController.editPost);

export default postRouter;
