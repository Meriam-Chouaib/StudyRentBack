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

//-------------------------sign in ------------
export const getUser = async (email: string) => {
  return await db.user.findUnique({
    where: { email },
  });
};

export const getUserById = async (id: number) => {
  return await db.user.findFirst({
    where: { id },
  });
};
export const getUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: { email },
  });
};

export const getAllUsers = async () => {
  return await db.user.findMany();
};

export const updateUser = async (userId: number, user: User) => {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: user,
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};
