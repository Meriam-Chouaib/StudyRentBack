import { IncomingHttpHeaders } from 'http';

export const getTokenFromHeaders = (header: IncomingHttpHeaders) => {
  const token = header.authorization?.split(' ')[1];
  console.log('header from getTokenFromHeaders', header);

  return token;
};
