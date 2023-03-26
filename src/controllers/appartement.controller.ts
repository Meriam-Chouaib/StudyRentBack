import { Appartement } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import * as appartementService from '../services/appartement.service';
import ApiError from '../errors/ApiError';

//------------------------- create post --------------------------------------
/**
 * create post
 * @param req
 * @param res
 * @param next
 */

const createAppartement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: Appartement = req.body as Appartement;
    const appartement = await appartementService.createAppartement(data);
    res.status(httpStatus.OK).send(appartement);
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

export { createAppartement };
