import { Appartement } from '@prisma/client';
import Joi from 'joi';
import { CreateAppartement } from '../../types/appartement/appartement.types';

const appartmentBody: Record<keyof CreateAppartement, any> = {
  state: Joi.string().required().min(3),
  city: Joi.string().required().min(3),
  surface: Joi.number().required(),
  nbRooms: Joi.number().required(),
  nbRoommate: Joi.number().required(),
  price: Joi.number().required(),
  //id: Joi.number().optional().empty(),
  //isLocated: Joi.boolean().optional(),
};

export const appartmentCreate = {
  body: Joi.object().keys(appartmentBody),
};
