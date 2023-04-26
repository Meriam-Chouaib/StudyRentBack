import dotenv from 'dotenv';

dotenv.config();

const PORT = Number.parseInt(process.env.PORT, 10);
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const jwtSecret = 'SITUHGZERH65E874RY6J34E3TUKJ84E3TY85J4K?E3ZTUY84J3ETU8KE3YIU54K3RYI';
const jwtExpiration = '1h';
const ENV = process.env.ENVIRONMENT || 'development';

export const config = {
  ENV,
  PORT,
  MYSQL_DATABASE,
  jwtSecret,
  jwtExpiration,
};
