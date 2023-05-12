import { createFiles } from './file.queries';
import { Favorite, Files, Post, Prisma, User } from '@prisma/client';
import { Filter, GetFavoriteListParams, GetPostsParams } from '../types/post/post.types';
import { getDbInstance } from '../database';
import * as userQueries from '../queries/user.queries';
import { applyFilters, testValue } from '../utils/whereResult';

//-----------connection to the database
const db = getDbInstance();

// create post
interface FilterFields {
  city?: string;
  title?: string;
  nb_rooms?: number;
  price?: number[];
  surface?: number[];
}

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
    let filters = {};
    if (page && rowsPerPage) {
      filters = {
        ...filters,
        skip: (page - 1) * rowsPerPage,
        take: rowsPerPage,
        include: {
          files: true,
        },
      };
    }
    if (filter) {
      const filterObject: FilterFields = JSON.parse(filter.toString());
      const { nb_rooms, price, surface, title, city } = filterObject;
      console.log(filterObject);
      filters = {
        ...filters,
        where: applyFilters<FilterFields>(filterObject),
      };
    }

    return await db.post.findMany(filters);
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
        postal_code: post.postal_code.toString(),
        price: post.price,
        state: post.state,
        posterId: post.posterId,
        surface: Number(post.surface),
        datePost: new Date(),
        files: {
          create: filesData.map((file: Express.Multer.File) => {
            return {
              id: undefined,
              postId: post.id,
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
export const addPostToFavorite = async (userId: number, postId: number): Promise<Post> => {
  console.log(userId, postId);

  try {
    const postAdded: Favorite = await db.favorite.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
    return getPostById(postAdded.postId);
  } catch (err) {
    console.log(err);
  }
};
export const getListFavorite = async ({
  page,
  rowsPerPage,
  filter,
  userId,
}: GetFavoriteListParams): Promise<Favorite[]> => {
  try {
    let filters = {};
    if (page && rowsPerPage) {
      filters = {
        ...filters,
        skip: (page - 1) * rowsPerPage,
        take: rowsPerPage,
        include: {
          files: true,
        },
      };
    }
    filters = {
      ...filters,
      where: { userId: userId },
      include: { post: true },
    };
    return await db.favorite.findMany(filters);
  } catch (err) {
    console.log(err);
  }
};
export const deletePostFromFavorisList = async (id: number): Promise<void> => {
  try {
    await db.favorite.delete({
      where: {
        id: id,
      },
      select: { postId: true, userId: true },
    });
  } catch (err) {
    console.log(err);
  }
};
