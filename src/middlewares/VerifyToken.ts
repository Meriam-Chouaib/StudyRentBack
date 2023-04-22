import { Response, NextFunction } from 'express';
import { getTokenFromHeaders } from '../utils';
import * as userQueries from '../queries/user.queries';
import { Request as ExpressRequest } from 'express';

import { decodeToken } from '../services/jwt.service';

interface Request extends ExpressRequest {
  userId: number;
}
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return res.status(403).send({
      status: 403,
      message: 'No token provided!',
    });
  }

  try {
    var decoded = decodeToken(token, next);
    req.userId = decoded.id;
    next();
  } catch (err) {
    next(err);
  }
};
