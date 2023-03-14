import Joi from 'joi';
import { CreatePost } from '../../types/post/post.types';

const postBody: Record<keyof CreatePost, any> = {
  title: Joi.string().required().min(6).max(30),
  description: Joi.string().required().min(6).max(30),
  posterId: Joi.number().required(),
  appartementId: Joi.number().required(),
};

export const postCreate = {
  body: Joi.object().keys(postBody),
};
