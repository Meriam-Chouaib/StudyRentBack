import { Post, Prisma } from '@prisma/client';
import { GetPostsParams } from '../types/post/post.types';
import { getDbInstance } from '../database';

//-----------connection to the database
const db = getDbInstance();

// create post
export const createPost = async (post: Post): Promise<Post> => {
  return await db.post.create({
    data: { ...post },
  });
};

// get posts filtred
export const getPosts = async ({ page, rowsPerPage, filter }: GetPostsParams): Promise<Post[]> => {
  return await db.post.findMany({
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
    where: filter,
  });
};
