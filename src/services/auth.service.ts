import { User } from '@prisma/client';
import * as userQueries from '../queries/userQueries';
import bcrypt from 'bcrypt';
import { signToken } from './jwt.service';

//-------------------------sign up ------------
const signUp = async (data: User) => {
  data.password = await bcrypt.hash(data.password, 15);
  return await userQueries.signUp({ ...data });
};

//-------------------------sign in ------------
const signIn = async (email: string, password: string) => {
  const user = await userQueries.getUser(email);
  if (!user) {
    throw new Error('User not found');
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error('Invalid password');
  }

  return signToken(user.id);
};

export { signUp, signIn };
