import express from 'express';
import { signUp, signIn } from '../controllers/auth.controller';
import { Endpoints } from '../config/endpoints';

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

authRouter.post(Endpoints.auth.SIGNUP, signUp);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: authentification of the user
 *     description: authentification of the user
 *       200:
 *         description: User authenticated!
 */
authRouter.post(Endpoints.auth.SIGNIN, signIn);

export default authRouter;
