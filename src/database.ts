import { PrismaClient } from '@prisma/client';
import { Logger } from './logger';
let database: PrismaClient;

export const getDbInstance = (): PrismaClient => {
  if (!database) {
    database = new PrismaClient();
    database
      .$connect()
      .then(() => {
        Logger.info('Connected to database', 'APP');
      })
      .catch((err: any) => {
        Logger.error(err.message, 'Datasource');
      });
  }
  return database;
};
