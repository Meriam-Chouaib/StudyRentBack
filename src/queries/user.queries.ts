import { User, user_role } from '@prisma/client';
import { getDbInstance } from '../database';
import { GetPostsParams } from '../types/post/post.types';
import { applyFilters } from '../utils/whereResult';
import { GetUsersParams } from '../types/user/user.types';

//--------------------------connection to the database-----------------------------
const db = getDbInstance();

//----------------------------interface filter User--------------------------------
interface FilterFields {
  search?: string;
}

//------------------------------sign up --------------------------------------------
export const signUp = async (user: User): Promise<User> => {
  return await db.user.create({
    data: { ...user },
  });
};

//-------------------------Get user by email------------------------------------------------
export const getUser = async (email: string) => {
  return await db.user.findUnique({
    where: { email },
  });
};

//-------------------------Get user by id------------------------------------------------

export const getUserById = async (id: number) => {
  return await db.user.findFirst({
    where: { id: Number(id) },
  });
};

//-------------------------Get user by email------------------------------------------------

export const getUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: { email },
  });
};
//-------------------------Get all users------------------------------------------------

export const getAllUsers = async ({
  page,
  rowsPerPage,
  search,
  role,
}: GetUsersParams): Promise<User[]> => {
  let filters: any = { where: {} };
  if (page && rowsPerPage) {
    filters = {
      ...filters,
      skip: (page - 1) * rowsPerPage,
      take: rowsPerPage,
    };
  }

  if (search) {
    filters = {
      ...filters,
      where: {
        OR: [
          { email: { contains: search } },
          { username: { contains: search } },
          { university: { contains: search } },
          { universityAddress: { contains: search } },
          { phone: { contains: search } },
        ],
        role: { equals: role }, // Filter users with the role "STUDENT"
      },
    };
  } else {
    filters = {
      ...filters,
      where: {
        role: { equals: role },
      },
    };
  }

  return await db.user.findMany(filters);
};

//-------------------------Get the number of total users------------------------------------------------

export const getNumberUsers = async (filterFields: GetPostsParams) => {
  const { search, role } = filterFields;
  let filters: any = { where: {} };

  if (search) {
    filters = {
      ...filters,
      where: {
        OR: [
          { email: { contains: search } },
          { username: { contains: search } },
          { university: { contains: search } },
          { universityAddress: { contains: search } },
          { phone: { contains: search } },
        ],
        role: { equals: role },
      },
    };
  } else {
    filters = {
      ...filters,
      where: {
        role: { equals: role },
      },
    };
  }
  const count = await db.user.count(filters);

  return count;
};

//-------------------------update user------------------------------------------------

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
//-------------------------Delete user by id------------------------------------------------

export const deleteUserById = async (userId: number) => {
  try {
    return await db.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.log(error);
  }
};
