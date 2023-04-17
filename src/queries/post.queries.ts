import { createFiles } from './file.queries';
import { Files, Post, Prisma, User } from '@prisma/client';
import { GetPostsParams } from '../types/post/post.types';
import { getDbInstance } from '../database';
import * as userQueries from '../queries/user.queries';

//-----------connection to the database
const db = getDbInstance();

// create post

export const createPost = async (post: Post, filesData: Express.Multer.File[]): Promise<Post> => {
  try {
    return await db.post.create({
      data: {
        description: post.description,
        title: post.title,
        city: post.city,
        nb_roommate: post.nb_roommate,
        nb_rooms: post.nb_rooms,
        isLocated: false,
        likes: 0,
        postal_code: post.postal_code,
        price: post.price,
        state: post.state,
        posterId: post.posterId,
        surface: Number(post.surface),
        datePost: new Date(),
        files: {
          create: filesData.map((file: Express.Multer.File) => {
            return {
              id: undefined,
              postId: undefined,
              filename: file.filename,
              path: file.path,
            };
          }),
        },
      },
      include: {
        files: true,
      },
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

// get posts by owner

export const getPostsByOwner = async ({
  page,
  rowsPerPage,
  filter,
  idOwner,
}: GetPostsParams): Promise<Post[]> => {
  try {
    return await db.post.findMany({
      skip: (page - 1) * rowsPerPage,
      take: rowsPerPage,
      where: {
        posterId: idOwner,
      },
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
// delete post by id
export const deletePost = async (postId: number): Promise<void> => {
  try {
    await db.post.delete({
      where: { id: postId },
    });
  } catch (err) {
    console.log(err);
  }
};

// edit post by id
export const editPost = async (
  postId: number,
  post: Post,
  filesData: Express.Multer.File[],
): Promise<Post | null> => {
  try {
    const updatedPost: Post | null = await db.post.update({
      where: { id: postId },

      data: {
        description: post.description,
        title: post.title,
        city: post.city,
        nb_roommate: post.nb_roommate,
        nb_rooms: post.nb_rooms,
        isLocated: false,
        likes: 0,

        datePost: new Date(),
        files: {
          create: filesData.map((file: Express.Multer.File) => {
            return {
              id: undefined,
              postId: undefined,
              filename: file.filename,
              path: file.path,
            };
          }),
        },
      },
      include: {
        files: true,
      },
    });
    return updatedPost;
  } catch (err) {
    console.log(err);
  }
};
