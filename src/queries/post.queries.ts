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

export const getPosts = async ({
  page,
  rowsPerPage,
  filter,
  universityAddress,
  idOwner,
}: GetPostsParams): Promise<Post[]> => {
  try {
    console.log('filteeeeeeeeeerr', filter);

    let filters: any = { where: {} }; // Initialize filters with a default value
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
      console.log('filter', filter);

      const filterObject: FilterFields = JSON.parse(filter.toString());
      const { nb_rooms, price, surface, title, city } = filterObject;
      console.log(filterObject);
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

    return await db.post.findMany(filters);
  } catch (err) {
    console.log(err);
  }
};
export interface responseGetTotalPosts {
  nbPosts: number;
  posts: Post[];
}
export const getTotalPosts = async (filter: Filter): Promise<responseGetTotalPosts> => {
  try {
    let filters = {};
    if (filter && filter !== undefined) {
      const filterObject: FilterFields = JSON.parse(filter.toString());
      const { nb_rooms, price, surface, title, city } = filterObject;
      console.log(filterObject);
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

    const allposts = await db.post.findMany(filters);
    // console.log('allposts', allposts);

    return { nbPosts: allposts.length, posts: allposts };
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

export const getTotalListFavorite = async (userId: number): Promise<number> => {
  try {
    let filters = {};

    filters = {
      ...filters,
      include: {
        files: true,
      },
    };

    filters = {
      ...filters,
      where: { userId: userId },
      include: { post: true },
    };
    const posts = await db.favorite.findMany(filters);
    return posts.length;
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
