import express, { Application, Request, Response } from 'express';
import { Endpoints } from '../config/endpoints';
import authRoutes from './auth.routes';

export const router = express.Router();
router.use(Endpoints.auth.ROOT, authRoutes);
