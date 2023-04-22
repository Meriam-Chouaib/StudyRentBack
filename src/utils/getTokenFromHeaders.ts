import { IncomingHttpHeaders } from 'http';

export const getTokenFromHeaders = (header: IncomingHttpHeaders) => {
  const token = header.authorization?.split(' ')[1];

  return token;
};
