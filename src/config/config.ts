import dotenv from 'dotenv';

dotenv.config();

const PORT = Number.parseInt(process.env.PORT, 10);
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const jwtSecret = 'secret';
const jwtExpiration = '1h';
const ENV = process.env.ENVIRONMENT || 'development';

export const config = {
  ENV,
  PORT,
  MYSQL_DATABASE,
  jwtSecret,
  jwtExpiration,
};
