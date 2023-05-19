import { Request, Response, NextFunction } from 'express';
import { geocodeAddress } from '../services/geocodeService';
import { ApiError } from '../errors';

export const geocodeAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { state, postal_code, city } = req.body;
  try {
    const { latitude, longitude } = await geocodeAddress(state, postal_code, city);
    res.json({ latitude, longitude });
  } catch (e) {
    res.json(e);
    console.log(e);
  }
};
