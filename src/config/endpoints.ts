export const Endpoints = {
  APIDOCS: '/api-docs',
  API: '/api',
  ROOT: '/',
  auth: {
    ROOT: '/auth',
    SIGNUP: '/signup',
    SIGNIN: '/signin',
  },
  post: {
    ROOT: '/posts',
    CREATE: '/create',
    SINGLE: '/:id',
    LIST: '/postsByOwner',
    FILTRED: '/filtered',
    FILES: '/files/:id',
    FAVORIS: '/favoris/:userId/:postId',
    ListFavoris: '/favoris/:id',
    MIN_PRICE: '/minPrice',
    MAX_PRICE: '/maxPrice',
    MIN_SURFACE: '/minSurface',
    MAX_SURFACE: '/maxSurface',
    NEAR_POSTS: '/near/:id',
  },
  allPosts: '/totalPosts',

  user: {
    ROOT: '/users',
    ALL: '/users',
    detail: '/:id',
  },

  geocode: '/geocode',
};
