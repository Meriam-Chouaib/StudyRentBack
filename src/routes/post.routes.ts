import express from 'express';
import { Endpoints } from '../config/endpoints';
import { validate } from '../middlewares/validate.middleware';
import { PostController } from '../controllers';

import { postSchema } from '../Schemas/post';
import upload from '../middlewares/multer';
import { verifyToken } from '../middlewares/VerifyToken';
import { isRole } from '../middlewares/AuthoriseRole';
import { paginationSchema } from '../Schemas/pagination/Pagination.validation';
import { validateParams } from '../middlewares/pagination.validate';
import { geocodeController } from '../controllers';

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

postRouter.get(Endpoints.ROOT, validateParams(paginationSchema), PostController.getPosts);

// _____________________________________________________________ get Price maximal___________________________________________________________

postRouter.get(Endpoints.post.MAX_PRICE, PostController.getMaximalPostPrice);

// _____________________________________________________________ get surface maximal___________________________________________________________

postRouter.get(Endpoints.post.MAX_SURFACE, PostController.getMaximalPostSurface);

// _____________________________________________________________ get Price minimal___________________________________________________________

postRouter.get(Endpoints.post.MIN_PRICE, PostController.getMinimalPostPrice);

// _____________________________________________________________ get surface minimal___________________________________________________________

postRouter.get(Endpoints.post.MIN_SURFACE, PostController.getMinimalPostSurface);

/**
 * @swagger
 * /:
 *   posts:
 *     summary: Get list of posts filtred
 *     description: Get list of posts filtred
 *       200:
 *         description: list of posts filtred
 */

// postRouter.get(Endpoints.post.FILTRED, PostController.getPostsFiltred);

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
 *     summary: Get post by id
 *     description: Get post by id
 *       200:
 *         description: post returns successfully
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

postRouter.delete(
  Endpoints.post.SINGLE,
  verifyToken,
  isRole(['ADMIN', 'OWNER']),
  PostController.deletePost,
);
postRouter.delete(
  Endpoints.post.FILES,
  verifyToken,
  isRole(['ADMIN', 'OWNER']),
  PostController.deleteFiles,
);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Edit post
 *     description: Edit post
 *       200:
 *         description: Post edited successfully
 */
postRouter.patch(
  Endpoints.post.SINGLE,
  validate(postSchema.postSchema),
  upload.array('files'),
  verifyToken,
  isRole(['ADMIN', 'OWNER']),
  PostController.editPost,
);

/**
 * @swagger
 * /:
 *   post:
 *     summary: get list of favorite
 *     description: get Favorite list
 *       200:
 *         description: Get Favorite list successfully
 */
postRouter.get(Endpoints.post.ListFavoris, verifyToken, PostController.getFavoriteList);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Add post to favorite list
 *     description: Add post to favorite list
 *       200:
 *         description: Add post to favorite list successfully
 */
postRouter.post(Endpoints.post.FAVORIS, verifyToken, PostController.addPostToFavorite);

/**
 * @swagger
 * /:
 *   post:
 *     summary: delete post from favorite list
 *     description: delete post from favorite list
 *       200:
 *         description: delete post from favorite list successfully
 */
postRouter.delete(Endpoints.post.FAVORIS, verifyToken, PostController.deletePostFromFavoris);

/**
 * @swagger
 * /:
 *   post:
 *     summary: get localisation
 *     description: get localisation
 *       200:
 *         description: Get localisation successfully
 */
postRouter.post(
  Endpoints.geocode,
  validate(postSchema.addressSchema),
  verifyToken,
  geocodeController.geocodeAddresse,
);
postRouter.get(Endpoints.post.NEAR_POSTS, verifyToken, PostController.getNearestPostsToUniversity);

export default postRouter;
