/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { config } from '../config/config';
import { Logger } from '../logger';
import ApiError from './ApiError';

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  Logger.error(err, 'ErrorHandler');

  if (config.ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals['errorMessage'] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.ENV === 'development' && { stack: err.stack }),
  };

  if (config.ENV === 'development') {
    Logger.error(err);
  }

  res.status(statusCode).json(response);
};
