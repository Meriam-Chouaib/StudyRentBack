import express from 'express';
import { Endpoints } from '../config/endpoints';
import { validate } from '../middlewares/validate.middleware';
import { PostController } from '../controllers';

import { postSchema } from '../Schemas/post';

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

postRouter.post(Endpoints.post.CREATE, validate(postSchema.postCreate), PostController.createPost);

export default postRouter;
