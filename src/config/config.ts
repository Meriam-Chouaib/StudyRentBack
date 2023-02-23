import dotenv from 'dotenv';

dotenv.config();

const PORT = Number.parseInt(process.env.PORT, 10);
const DATABASE_URL = process.env.DATABASE_URL;

export const config = {
  PORT,
  DATABASE_URL,
};
