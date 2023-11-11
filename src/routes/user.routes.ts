import express from 'express';
import { Endpoints } from '../config/endpoints';
import { userController } from '../controllers';
import { verifyToken } from '../middlewares/VerifyToken';
import { isRole } from '../middlewares/AuthoriseRole';

const userRouter = express.Router();

/**
 * @swagger
 * /:
 *   user:
 *     summary: edit user
 *     description: edit user
 *       200:
 *         description: user updated successfully
 */
userRouter.patch(Endpoints.user.detail, verifyToken, userController.editUser);

/**
 * @swagger
 * /:
 *   user:
 *     summary: Get all sers
 *     description:Get all sers
 *       200:
 *         description: the list of user rendered successfully
 */
userRouter.get(Endpoints.ROOT, verifyToken, userController.getAllUsers);
/**
 * @swagger
 * /:
 *   user:
 *     summary: get user by id
 *     description: get user by id
 *       200:
 *         description: user rendered successfully
 */
userRouter.get(Endpoints.user.detail, verifyToken, userController.getUserById);

/**
 * @swagger
 * /:
 *   user:
 *     summary: delete user by id
 *     description: delete user by id
 *       200:
 *         description: user deleted successfully
 */
userRouter.delete(
  Endpoints.user.detail,
  verifyToken,
  // isRole(['ADMIN']),
  userController.deleteUserById,
);

export default userRouter;
