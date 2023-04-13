import { IncomingHttpHeaders } from 'http';

export const getTokenFromHeaders = (header: IncomingHttpHeaders) => {
  const token = header.authorization?.split(' ')[1];
  console.log('00000000000', header);

  return token;
};
