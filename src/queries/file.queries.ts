import { Files } from '@prisma/client';
import { getDbInstance } from '../database';

//-----------connection to the database
const db = getDbInstance();

export const createFiles = async (file: Omit<Files, 'id'>): Promise<Files> => {
  const fileCreated = await db.files.create({
    data: { ...file },
  });

  return fileCreated;
};
