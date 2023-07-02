import { User } from '@prisma/client';
import * as userQueries from '../queries/user.queries';
import bcrypt from 'bcrypt';
import { signToken } from './jwt.service';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import * as MESSAGES from '../utils/globals';
import ApiResponse from '../utils/ApiResponse';

//---------------------------------sign up -----------------------
const signUp = async (data: User) => {
  try {
    if (await userQueries.getUser(data.email)) {
      throw new ApiError(httpStatus.CONFLICT, MESSAGES.EMAIL_EXISTS);
    } else {
      const hash = bcrypt.hashSync(data.password, 15);
      data.password = hash;
      data.image = 'test.png';
      const user = await userQueries.signUp(data);

      const token = signToken({ id: user.id, email: data.email });
      const result = { user, token };
      return new ApiResponse(200, result, 'User created successfully!');
    }
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};

//-----------------------------------sign in ---------------
const signIn = async (email: string, password: string) => {
  try {
    const user = await userQueries.getUser(email);
    if (!user) {
      throw new ApiError(404, 'signin.email_not_found');
    } else {
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new ApiError(404, 'signin.password_invalid_back');
      } else if (user.role !== 'ADMIN' && user.statut === 'OFFLINE') {
        throw new ApiError(403, 'signin.user_blocked');
      } else {
        const token = signToken({ id: user.id, email: user.email });

        const data = { user, token };
        return new ApiResponse(200, data, 'User logged successfully!');
      }
    }
  } catch (e) {
    throw new ApiError(e.statusCode, e.message);
  }
};
//------------------------------update user------------------

const updateUser = async (userId: number, user: User) => {
  try {
    const userUpdated = await userQueries.updateUser(userId, user);
    return new ApiResponse(httpStatus.OK, userUpdated, 'user updated succiusfully!');
  } catch (error) {
    console.log(error);
  }
};

export { signUp, signIn, updateUser };
