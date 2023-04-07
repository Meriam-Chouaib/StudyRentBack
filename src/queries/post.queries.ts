import { Post, Prisma } from '@prisma/client';
import { GetPostsParams } from '../types/post/post.types';
import { getDbInstance } from '../database';

//-----------connection to the database
const db = getDbInstance();

// create post

export const createPost = async (post: Post): Promise<Post> => {
  try {
    return await db.post.create({
      data: { ...post },
    });
  } catch (err) {
    console.log(err);
  }
};

// get posts filtred

export const getPosts = async ({ page, rowsPerPage, filter }: GetPostsParams): Promise<Post[]> => {
  try {
    return await db.post.findMany({
      skip: (page - 1) * rowsPerPage,
      take: rowsPerPage,
      where: filter,
      include: {
        files: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
// get post by id
export const getPostById = async (postId: number): Promise<Post | null> => {
  try {
    const post: Post | null = await db.post.findUnique({
      where: { id: postId },
      include: {
        files: true,
      },
    });
    return post;
  } catch (err) {
    console.log(err);
  }
};
