import express from 'express';
import { Endpoints } from '../config/endpoints';
import { AuthController } from '../controllers';

const userRouter = express.Router();

/**
 * @swagger
 * /getUserById:
 *   user:
 *     summary: getUserById
 *     description: getUserById
 *       200:
 *         description: getUserById successfully!
 */

userRouter.get(Endpoints.user.detail, AuthController.signUp);

export default userRouter;
