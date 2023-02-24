import express, { Application, Request, Response } from 'express';
import { Endpoints } from '../config/endpoints';
import authRoutes from './auth.routes';

export const mainRouter = express.Router();
mainRouter.use(Endpoints.auth.ROOT, authRoutes);
