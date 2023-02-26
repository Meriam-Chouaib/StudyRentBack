import express from 'express';
import { Endpoints } from '../config/endpoints';
import { validate } from '../middlewares/validate.middleware';
import {  AuthController} from '../controllers';
import { authSchema } from '../schemas/auth';

const authRouter = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user
 *       200:
 *         description: User created successfully!
 */

authRouter.post(Endpoints.auth.SIGNUP, validate(authSchema.register), AuthController.signUp);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: authentification of the user
 *     description: authentification of the user
 *       200:
 *         description: User authenticated!
 */
authRouter.post(Endpoints.auth.SIGNIN, AuthController.signIn);

export default authRouter;
