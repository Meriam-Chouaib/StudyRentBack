import express, { Application, Request, Response } from 'express';
import { Endpoints } from '../config/endpoints';
import appartementRoutes from './appartement.routes';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';

export const mainRouter = express.Router();
mainRouter.use(Endpoints.auth.ROOT, authRoutes);
mainRouter.use(Endpoints.post.ROOT, postRoutes);
mainRouter.use(Endpoints.appartement.ROOT, appartementRoutes);
