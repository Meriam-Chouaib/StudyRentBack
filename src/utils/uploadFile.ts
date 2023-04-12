export const createFile = (file: Express.Multer.File) => {
  const fileBuffer = new Uint8Array(file.buffer);
  const fileInstance = new File([fileBuffer], file.originalname, {
    type: file.mimetype,
  });
  return fileInstance;
};
