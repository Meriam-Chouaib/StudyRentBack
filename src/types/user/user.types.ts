import { User } from '@prisma/client';

export type SignUpUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type GetUsersParams = {
  page: number;
  rowsPerPage: number;
  search?: string;
  role?: string;
};
