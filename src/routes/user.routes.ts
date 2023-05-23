import express from 'express';
import { Endpoints } from '../config/endpoints';
import { userController } from '../controllers';
import { verifyToken } from '../middlewares/VerifyToken';

const userRouter = express.Router();

userRouter.patch(Endpoints.user.detail, verifyToken, userController.editUser);
userRouter.get(Endpoints.ROOT, verifyToken, userController.getAllUsers);
userRouter.get(Endpoints.user.detail, verifyToken, userController.getUserById);

export default userRouter;
