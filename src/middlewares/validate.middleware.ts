import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import pick from '../utils/pick';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import { Logger } from '../logger';
import { ValidationError } from '../errors/ValidationError';
// TODO conversion from string to json avant pick
export const validate =
  (schema: Record<string, any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const validSchema = pick(schema, ['params', 'query', 'body']);

    const object = pick(req, Object.keys(validSchema));

    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object);
    if (error) {
      // TODO - Change this hard coded message to a global variables declaration
      const errorMessage = 'Please check your fields';
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
    return next();
  };
