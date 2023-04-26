import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { NextFunction } from 'express';
interface JWTPayload {
  id: number;
  email: string;
}
// const signToken = (id: number) => {
//   const token = jwt.sign({ payload: id }, config.jwtSecret, {
//     expiresIn: config.jwtExpiration,
//   });
//   return token;
// };

const signToken = (payload: JWTPayload) => {
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
  return token;
};
const decodeToken = (token: string, next: NextFunction) => {
  try {
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return decodedToken;
  } catch (err) {
    console.error(err);
    return null;
  }
};
export { signToken, decodeToken };
