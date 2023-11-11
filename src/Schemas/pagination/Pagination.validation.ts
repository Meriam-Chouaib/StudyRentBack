import Joi from 'joi';
export const paginationSchema = Joi.object().keys({
  page: Joi.number().required(),
  rowsPerPage: Joi.number().required(),
  filter: Joi.any().optional(),
  idStudent: Joi.any().optional(),
  idOwner: Joi.any().optional(),
  universityAddress: Joi.any().optional(),
  search: Joi.any().optional(),
});
