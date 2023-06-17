import { createFiles } from './file.queries';
import { Favorite, Files, Post, Prisma, User } from '@prisma/client';
import { Filter, GetFavoriteListParams, GetPostsParams } from '../types/post/post.types';
import { getDbInstance } from '../database';
import * as userQueries from '../queries/user.queries';
import { applyFilters, testValue } from '../utils/whereResult';

//-----------connection to the database
const db = getDbInstance();

interface FilterFields {
  city?: string;
  title?: string;
  nb_rooms?: number;
  price?: number[];
  surface?: number[];
}
export interface responseGetTotalPosts {
  nbPosts: number;
  posts: Post[];
}

// _______________________________________________________ create post______________________________________________________________________
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

// _______________________________________________________ get posts filtred ______________________________________________________________________
export const getPosts = async ({
  page,
  rowsPerPage,
  filter,
  universityAddress,
  idOwner,
  search,
}: GetPostsParams): Promise<Post[]> => {
  try {
    let filters: any = { where: {} };
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

      filters = {
        ...filters,
        where: applyFilters<FilterFields>(filterObject),
      };
    }
    if (universityAddress) {
      filters = {
        ...filters,
        where: {
          ...filters.where,
          city: {
            equals: universityAddress,
          },
        },
      };
    }
    if (search) {
      filters = {
        ...filters,
        where: {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { city: { contains: search } },
            { state: { contains: search } },
            { postal_code: { contains: search } },
          ],
        },
      };
    }

    return await db.post.findMany(filters);
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________ get total posts  ______________________________________________________________________
export const getTotalPosts = async (
  filter: Filter,
  search: string,
): Promise<responseGetTotalPosts> => {
  try {
    let filters = {};
    if (filter && filter !== undefined) {
      const filterObject: FilterFields = JSON.parse(filter.toString());
      const { nb_rooms, price, surface, title, city } = filterObject;
      filters = {
        ...filters,
        where: applyFilters<FilterFields>(filterObject),
      };
    }

    filters = {
      ...filters,
      include: {
        files: true,
      },
    };
    if (search) {
      filters = {
        ...filters,
        where: {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { city: { contains: search } },
            { state: { contains: search } },
            { postal_code: { contains: search } },
          ],
        },
      };
    }
    const allposts = await db.post.findMany(filters);

    return { nbPosts: allposts.length, posts: allposts };
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________ get posts by owner  ______________________________________________________________________
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

// _______________________________________________________ get total posts by owner  ______________________________________________________________________
export const getTotalPostsByOwner = async (filter, idOwner): Promise<number> => {
  try {
    const posts = await db.post.findMany({
      where: {
        posterId: idOwner,
      },
      include: {
        files: true,
      },
    });
    return posts.length;
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________ get post by id  ______________________________________________________________________
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

// _______________________________________________________ delete post by id  ______________________________________________________________________
export const deletePost = async (postId: number): Promise<void> => {
  try {
    await db.post.delete({
      where: { id: postId },
    });
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________  edit post by id  ______________________________________________________________________
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

// _______________________________________________________  Add post to favorite list  ______________________________________________________________________
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

// _______________________________________________________  Get favorite list ______________________________________________________________________

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
      };
    }
    filters = {
      ...filters,
      where: { userId: userId },
    };
    return await db.favorite.findMany(filters);
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________  Get total favorite list ______________________________________________________________________
export const getTotalListFavorite = async (userId: number): Promise<number> => {
  try {
    let filters = {};

    filters = {
      ...filters,
      where: { userId: userId },
    };
    const posts = await db.favorite.findMany(filters);
    return posts.length;
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________  delete Post From Favorite List ______________________________________________________________________
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

// _______________________________________________________  get Minimal Post Price  ______________________________________________________________________
export const getMinimalPostPrice = async (): Promise<Prisma.Decimal> => {
  try {
    const minimalPrice = await db.post.findFirst({
      orderBy: {
        price: 'asc',
      },
      select: {
        price: true,
      },
    });

    return minimalPrice?.price;
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________  get Maximal Post Price  ______________________________________________________________________
export const getMaximalPostPrice = async (): Promise<Prisma.Decimal> => {
  try {
    const maximalPrice = await db.post.findFirst({
      orderBy: {
        price: 'desc',
      },
      select: {
        price: true,
      },
    });

    return maximalPrice?.price;
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________  get minimal Post surface  ______________________________________________________________________
export const getMinimalPostSurface = async (): Promise<number> => {
  try {
    const minimalSurface = await db.post.findFirst({
      orderBy: {
        price: 'asc',
      },
      select: {
        surface: true,
      },
    });

    return minimalSurface?.surface;
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________  get Maximal Post Surface  ______________________________________________________________________
export const getMaximalPostSurface = async (): Promise<number> => {
  try {
    const maximalPrice = await db.post.findFirst({
      orderBy: {
        price: 'desc',
      },
      select: {
        surface: true,
      },
    });

    return maximalPrice?.surface;
  } catch (err) {
    console.log(err);
  }
};

// _______________________________________________________  get Data Posts  ______________________________________________________________________
export const getDataPosts = async (): Promise<responseGetTotalPosts> => {
  try {
    const allposts = await db.post.findMany();
    return { nbPosts: allposts.length, posts: allposts };
  } catch (err) {
    console.log(err);
  }
};
