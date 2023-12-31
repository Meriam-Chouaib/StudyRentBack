import express, { Application, Request, Response } from 'express';
import { Endpoints } from '../config/endpoints';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import userRoutes from './user.routes';

export const mainRouter = express.Router();
mainRouter.use(Endpoints.auth.ROOT, authRoutes);
mainRouter.use(Endpoints.post.ROOT, postRoutes);
mainRouter.use(Endpoints.user.ROOT, userRoutes);
