import { User } from '@prisma/client';
import * as userQueries from '../queries/user.queries';
import bcrypt from 'bcrypt';
import { signToken } from './jwt.service';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import * as MESSAGES from '../utils/globals';
import ApiResponse from '../utils/ApiResponse';

//-------------------------sign up ------------
const signUp = async (data: User) => {
  try {
      if (await userQueries.getUser(data.email)) {
        throw new ApiError(httpStatus.CONFLICT, MESSAGES.EMAIL_EXISTS);
      } else {
        const hash = bcrypt.hashSync(data.password, 15);
        data.password = hash;
        const userCreated = await userQueries.signUp(data);
        return new ApiResponse(200, userCreated, 'User created successfully!');
      }
  } catch (e) {
    console.log(e+'errrrr');
    
    throw new ApiError(e.statusCode, e.message);
  }

};

//-------------------------sign in ------------
const signIn = async (email: string, password: string) => {
 try {
   const user = await userQueries.getUser(email);
   if (!user) {
     throw new ApiError(404, MESSAGES.BAD_CREDENTIAL);
   } else {
     const passwordMatches = await bcrypt.compare(password, user.password);
     if (!passwordMatches) {
       throw new ApiError(404, MESSAGES.BAD_CREDENTIAL);
     } else {
      const token = signToken(user.id);
      const data = {user,token}
   return new ApiResponse(200, data, 'User logged successfully!');
          
     }
   }
 } catch (e) {
   
   throw new ApiError(e.statusCode, e.message);
 }
  
};

export { signUp, signIn };
