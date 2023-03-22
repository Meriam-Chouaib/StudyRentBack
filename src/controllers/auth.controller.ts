import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Logger } from '../logger';
import * as authService from '../services/auth.service';

//-------------------------sign up --------------------------------------
/**
 * Sign up user
 * @param req
 * @param res
 * @param next
 */

const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data: User = req.body as User;
  try {  
    const user = await authService.signUp(data);
    res.status(200).send(user);
  } catch (err) {

    next(err);
  }
};

//-------------------------sign in -------------------------------------
/**
 * Sign in user
 * @param req
 * @param res
 * @param next
 */
const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
  const result =     await authService.signIn(email, password);
 res.json({ result });
  } catch (err: any) {
  
     next(err);
  }
};

export { signUp, signIn };
