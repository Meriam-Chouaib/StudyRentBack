import Joi from 'joi';

//export const postSchema: Record<keyof Post, any> = Joi.object().keys({
export const postSchema = Joi.object().keys({
  id: Joi.number().optional().empty(),
  datePost: Joi.date().default(() => new Date()),
  title: Joi.string().required().min(6).max(30),
  description: Joi.string().required().min(6).max(30),
  likes: Joi.number().optional(),
  region: Joi.string().required().min(3),
  country: Joi.string().required().min(3),
  state: Joi.string().required().min(3),
  city: Joi.string().required().min(3),
  surface: Joi.number().required(),
  nbRooms: Joi.number().required(),
  nbRoommate: Joi.number().required(),
  price: Joi.number().required(),
  posterId: Joi.number().required(),

  isLocated: Joi.boolean().optional,
});
