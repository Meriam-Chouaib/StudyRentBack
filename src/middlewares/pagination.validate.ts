import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import { ValidationError } from '../errors/ValidationError';
import { CHECK_FIELDS } from '../utils';
export const validateParams =
  (schema: Record<string, any>) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = Joi.compile(schema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(req.query);

    console.log('value', value);
    console.log(error);

    if (error) {
      const errorMessage = CHECK_FIELDS;
      if (error.isJoi) {
        const details = error.details.map((details) => {
          return {
            field: details.context.key,
            value: details.context.value,
            message: details.message,
          };
        });
        res
          .status(httpStatus.BAD_REQUEST)
          .json(new ValidationError(httpStatus.BAD_REQUEST, errorMessage, details));
      } else {
        return next(error);
      }
    }
    Object.assign(req, value);
    //   req.data = value;
    return next();
  };
