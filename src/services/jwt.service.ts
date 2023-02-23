import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const signToken = (id: number) => {
  const token = jwt.sign({ id: id }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
  return token;
};

const verifyToken = (token: string): JwtPayload => {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

interface JwtPayload {
  id: number;
}

export { signToken, verifyToken };
