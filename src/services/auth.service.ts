import { User } from '@prisma/client';
import * as userQueries from '../queries/userQueries';
import bcrypt from 'bcrypt';

const signUp = async (data: User) => {
  data.password = await bcrypt.hash(data.password, 15);
  return await userQueries.signUp({ ...data });
};

export { signUp };
