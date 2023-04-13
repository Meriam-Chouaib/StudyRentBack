import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const signToken = (id: number) => {
  const token = jwt.sign({ payload: id }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
  return token;
};

const decodeToken = (token: string) => {
  try {
    const decodedToken = jwt.decode(token);
    return decodedToken;
  } catch (err) {
    console.error(err);
    return null;
  }
};
export { signToken, decodeToken };
