import Joi from 'joi';
import { SignUpUser } from '../../types/user/user.types';

const registerBody: Record<keyof SignUpUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,30}$'))
    .message('signup.password_invalid_back'),
  username: Joi.string().required().max(30),
  statut: Joi.string().required(),
  role: Joi.string().required(),
  image: Joi.string().optional(),
  isLogged: Joi.optional(),
  phone: Joi.optional(),
  university: Joi.optional(),
  universityAddress: Joi.optional(),
};

export const register = {
  body: Joi.object().keys(registerBody),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
