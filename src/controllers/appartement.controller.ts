import { validate } from './../middlewares/validate.middleware';
import { Appartement, Files } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import * as appartementService from '../services/appartement.service';
import ApiError from '../errors/ApiError';
import { appartmentCreate } from '../Schemas/appartement/appartement.validation';

//------------------------- create post --------------------------------------
/**
 * create post
 * @param req
 * @param res
 * @param next
 */

const createAppartement = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filesData = req.files as Express.Multer.File[];
    console.log('files', filesData);

    const appartementdata: Appartement = req.body as Appartement;

    const data = {
      ...appartementdata,
      files: filesData,
    };
    console.log('from controller', data);

    const appartement = await appartementService.createAppartement(data);
    res.status(httpStatus.OK).send(appartement);
    // res.status(apiResponse.status).send(apiResponse);
  } catch (e) {
    console.log(e);

    // next(e);
  }
};

export { createAppartement };
