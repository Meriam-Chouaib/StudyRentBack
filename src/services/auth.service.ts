import { User } from '@prisma/client';
import * as userQueries from '../queries/user.queries';
import bcrypt from 'bcrypt';
import { signToken } from './jwt.service';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import * as MESSAGES from '../utils/globals';

//-------------------------sign up ------------
const signUp = async (data: User) => {
  if (await userQueries.getUser(data.email)) {
    throw new ApiError(httpStatus.CONFLICT, MESSAGES.EMAIL_EXISTS);
  }

  const hash = bcrypt.hashSync(data.password, 15);
  data.password = hash;
  return await userQueries.signUp(data);
};

//-------------------------sign in ------------
const signIn = async (email: string, password: string) => {
  const user = await userQueries.getUser(email);

  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error(MESSAGES.INVALID_PASSWORD);
  }

  return signToken(user.id);
};

export { signUp, signIn };
