import { Appartement, Files } from '@prisma/client';
import ApiError from '../errors/ApiError';
import ApiResponse from '../utils/ApiResponse';
import * as appartementQueries from '../queries/appartement.queries';
import * as fileQueries from '../queries/file.queries';
import httpStatus from 'http-status';

import { omit } from 'lodash';

const createAppartement = async (data) => {
  const files: Omit<Files, 'id' | 'postId' | 'path' | 'typeFile'>[] = data.file;
  console.log(files);

  const apartementData = omit(data, 'file');
  const apartement = await appartementQueries.createAppartement({ ...apartementData });
  console.log('apartement from service', apartement);

  const createdFiles = await Promise.all(
    files?.map((file) => {
      fileQueries.createFiles({
        appartementId: apartement.id,
        filename: file.filename,
      });
    }),
  );
  console.log(createdFiles);

  // return new ApiResponse(httpStatus.OK, apartement, 'Apartement Created successfully!');
};

export { createAppartement };
