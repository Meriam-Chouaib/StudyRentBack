import { CreateFiles } from './../../types/files/files.types';
import Joi from 'joi';

const filesBody: Record<keyof CreateFiles, any> = {
  filename: Joi.string().optional,
};

export const fileCreate = {
  body: Joi.object().keys(filesBody),
};
