import { Post } from '@prisma/client';
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
    include: {
      files: true,
    },
  });
};
