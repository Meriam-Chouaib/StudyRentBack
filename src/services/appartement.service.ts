import { Appartement } from '@prisma/client';
import * as appartementQueries from '../queries/appartement.queries';


const createAppartement = async (data: Appartement) => {
  return await appartementQueries.createAppartement({ ...data });
};

export { createAppartement };
