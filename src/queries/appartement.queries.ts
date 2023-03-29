import { Appartement } from '@prisma/client';
import { getDbInstance } from '../database';

//-----------connection to the database
const db = getDbInstance();

export const createAppartement = async (appartement: Appartement): Promise<Appartement> => {
  try {
    console.log('data query', appartement);

    const savedAppartement = await db.appartement.create({
      data: appartement,
    });
    console.log('data saved', savedAppartement);
    return savedAppartement;
  } catch (err) {
    console.log(err.message);
  }
};
