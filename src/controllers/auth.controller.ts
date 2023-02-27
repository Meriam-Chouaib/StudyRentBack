import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

//-------------------------sign up --------------------------------------
/**
 * Sign up user
 * @param req
 * @param res
 * @param next
 */

const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: User = req.body as User;
    const user = await authService.signUp(data);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    const token = await authService.signIn(email, password);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export { signUp, signIn };
