import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const signToken = (id: number) => {
  const token = jwt.sign({ payload: id }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
  return token;
};

export { signToken };
