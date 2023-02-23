import express from 'express';
import { signUp } from '../controllers/auth.controller';
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

export default authRouter;
