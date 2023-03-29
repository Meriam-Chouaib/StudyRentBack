import upload from '../middlewares/multer';
import express from 'express';
import { Endpoints } from '../config/endpoints';
import { validate } from '../middlewares/validate.middleware';
import { AppartementController } from '../controllers';
import { appartementSchema } from '../Schemas/appartement';
import { fileSchema } from '../Schemas/file';

const appartementRouter = express.Router();

/**
 * @swagger
 * /create:
 *   appartement:
 *     summary: Create a new appartement
 *     description: Create a new appartement
 *       200:
 *         description: appartement created successfully!
 */

appartementRouter.post(
  Endpoints.appartement.CREATE,
  validate(appartementSchema.appartmentCreate),
  validate(fileSchema.fileCreate),
  upload.array('file'),
  AppartementController.createAppartement,
);

export default appartementRouter;
