import { Post } from '@prisma/client';
import { getDbInstance } from '../database';

//-----------connection to the database
const db = getDbInstance();

export const createPost = async (post: Post): Promise<Post> => {
  return await db.post.create({
    data: {...post},
  });
};
