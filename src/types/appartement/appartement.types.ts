import { Appartement } from '@prisma/client';

export type CreateAppartement = Omit<Appartement, 'id' | 'isLocated' | 'posts'>;
