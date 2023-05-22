import { Post, Prisma } from '@prisma/client';

export type CreatePost = Omit<Post, 'id' | 'likes' | 'datePost'>;
export type GetPostsParams = {
  page: number;
  rowsPerPage: number;
  filter?: Filter;
  idOwner?: number;
};
export type GetFavoriteListParams = {
  page?: number;
  rowsPerPage?: number;
  filter?: Filter;
  userId?: number;
};
export interface Filter {
  title?: string;
  nb_rooms?: number;
  price?: number[];
  surface?: number[];
  city?: string;
}
export interface minMaxInterval {
  min: number;
  max: number;
}
export interface Localization {
  longitude: number;
  latitude: number;
}
