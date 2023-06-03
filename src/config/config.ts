import dotenv from 'dotenv';

dotenv.config();

const PORT = Number.parseInt(process.env.PORT, 10) || 8000;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const jwtSecret = process.env.JWT_SECRET || '';
const jwtExpiration = process.env.JWT_EXPIRATION || '1h';
const ENV = process.env.ENVIRONMENT || 'development';

export const config = {
  ENV,
  PORT,
  MYSQL_DATABASE,
  jwtSecret,
  jwtExpiration,
};
