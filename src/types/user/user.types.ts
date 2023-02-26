import { User } from '@prisma/client';

export type SignUpUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
