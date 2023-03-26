import Joi from 'joi';
import { CreateAppartement } from '../../types/appartement/appartement.types';

const appartmentBody: Record<keyof CreateAppartement, any> = {
  region: Joi.string().required().min(3),
  country: Joi.string().required().min(3),
  state: Joi.string().required().min(3),
  city: Joi.string().required().min(3),
  surface: Joi.number().required(),
  nbRooms: Joi.number().required(),
  nbRoommate: Joi.number().required(),
  price: Joi.number().required(),
 
};

export const appartmentCreate = {
  body: Joi.object().keys(appartmentBody),
};
