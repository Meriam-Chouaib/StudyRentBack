import { Response, NextFunction } from 'express';
import { getUserById } from '../queries/user.queries';
import { Request } from '../types/types';

// verify role user
export const isRole =
  (roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('id user', req.userId);

      const user = await getUserById(req.userId);
      console.log('role user', user.role);

      if (!user) return res.status(500).send({ message: 'utilisateur introuvable' });

      if (roles.indexOf(user.role) === -1)
        return res.status(403).send({ message: 'Accès interdit' });
      else next();
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };
