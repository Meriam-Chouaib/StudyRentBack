import Joi from 'joi';
export const paginationSchema = Joi.object().keys({
  page: Joi.number().required(),
  rowsPerPage: Joi.number().required(),
  filter: Joi.any().optional(),
});
