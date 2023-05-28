import { Request, Response, NextFunction } from 'express';
import { geocodeAddress } from '../services/geocode.service';
import { ApiError } from '../errors';
import { Localization } from '../types/post/post.types';
import { Post } from '@prisma/client';

export const geocodeAddresse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { state, postal_code, city } = req.body;
  try {
    const { latitude, longitude } = await geocodeAddress(state, postal_code, city);
    res.json({ latitude, longitude });
  } catch (e) {
    res.status(e.statusCode).send(e.message);
  }
};
