import Joi from 'joi';

//export const postSchema: Record<keyof Post, any> = Joi.object().keys({
export const postSchema = Joi.object().keys({
  id: Joi.number().optional().empty(),

  datePost: Joi.date().default(() => new Date()),
  title: Joi.string().required().min(6).max(30),
  description: Joi.string().required().min(6).max(30),
  likes: Joi.number().optional(),
  state: Joi.string().required().min(3),
  city: Joi.string().required().min(3),
  surface: Joi.number().required(),
  nb_rooms: Joi.number().required(),
  nb_roommate: Joi.number().required(),
  price: Joi.number().required(),
  posterId: Joi.number().required(),
  isLocated: Joi.boolean().optional,
  postal_code: Joi.string().required(),
  files: Joi.any().required(),
});

export const addressSchema = Joi.object().keys({
  state: Joi.string().required().min(3),
  postal_code: Joi.string().required(),
  city: Joi.string().required().min(3),
});
