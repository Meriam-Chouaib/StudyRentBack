import { Request } from 'express';
import multer from 'multer';
import  ApiError  from '../errors/ApiError';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, 'public/assets/uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    
    cb(null, `${Date.now()}-${file.originalname}`);
  },
 

});

const upload = multer({ storage: storage});

export default upload;
