import { Files } from '@prisma/client';

export type CreateFiles = Omit<Files, 'id' | 'postId' | 'path' | 'typeFile'>;
