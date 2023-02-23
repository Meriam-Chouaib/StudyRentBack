import { User } from '@prisma/client';
import { getDbInstance } from '../database';

//-----------connection to the database

const db = getDbInstance();

//-------------------------sign up ------------

export const signUp = async (user: User): Promise<User> => {
  return await db.user.create({
    data: { ...user },
  });
};
