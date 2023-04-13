import { Post, Prisma } from '@prisma/client';

export type CreatePost = Omit<Post, 'id' | 'likes' | 'datePost'>;
export type GetPostsParams = {
  page: number;
  rowsPerPage: number;
  filter?: Prisma.PostWhereInput;
  idOwner?: number;
};
