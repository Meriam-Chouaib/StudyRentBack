import { Appartement } from '@prisma/client';
import { getDbInstance } from '../database';

//-----------connection to the database
const db = getDbInstance();

export const createAppartement = async (appartement: Appartement): Promise<Appartement> => {
  return await db.appartement.create({
    data: { ...appartement },
  });
};
