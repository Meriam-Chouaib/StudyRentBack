import { Request, Response, NextFunction } from 'express';
import { postSchema } from '../Schemas/post/post.validation';

export const postMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const { value, error } = postSchema.validate(body);
  if (error) {
    const { details } = error;
    const message = details.map((i) => i.message).join(',');

    console.log('error', message);
    res.status(422).json({ error: message });
  } else {
    next();
  }
};
