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
  },
  user: {
    ALL: '/users',
  },
  appartement: {
    ROOT: '/appartements',
    CREATE: '/create',
  },
  geocode: '/geocode',
};
