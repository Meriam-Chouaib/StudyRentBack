import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

//-------------------------sign up ------------
/**
 * Sign up user
 * @param req
 * @param res
 * @param next
 */

const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  5;
  console.log('hhhhhhhhhhhhhhhhh');
  try {
    const data: User = req.body;
    const user = await authService.signUp({ ...data });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
    next();
  }
};

export { signUp };
