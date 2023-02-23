import dotenv from 'dotenv';

dotenv.config();

const PORT = Number.parseInt(process.env.PORT, 10);
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

export const config = {
  PORT,
  MYSQL_DATABASE,
};
