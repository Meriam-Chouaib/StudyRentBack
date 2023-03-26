import { Post } from '@prisma/client';

export type CreatePost = Omit<Post, 'id' | 'likes' | 'datePost'>;
