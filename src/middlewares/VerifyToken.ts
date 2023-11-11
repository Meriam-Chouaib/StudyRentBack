import { Response, NextFunction } from 'express';
import { getTokenFromHeaders } from '../utils';
import { Request } from '../types/types';
import { decodeToken } from '../services/jwt.service';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return res.status(403).send({
      status: 403,
      message: 'No token provided!',
    });
  }

  try {
    var decoded = await decodeToken(token, next);
    if (decoded) {
      req.userId = decoded.id;
    }
    next();
  } catch (err) {
    next(err);
  }
};
