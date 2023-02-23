import { PrismaClient } from '@prisma/client';

let database: PrismaClient;

export const getDbInstance = (): PrismaClient => {
  if (!database) {
    database = new PrismaClient();
    database
      .$connect()
      .then(() => {
        console.log('Connected to database');
      })
      .catch((err: any) => {
        console.error('Error connecting to database:', err);
      });
  }
  return database;
};
