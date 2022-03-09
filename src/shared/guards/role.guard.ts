import { ForbiddenError } from '../../errors';
import { NextFunction, Request, Response } from 'express';
import { CurrentUserType } from '../types/CurrentUser';

interface RoleGuardOptions {
  /**
   * If false, this tells the guard to allow the request to go through without throwing
   * an error even if authorization is failed. Defaults to `true`.
   */
  strict?: boolean;
}

/**
 * This guard is to be instantiated with an array of user roles allowed to go through on a request.
 */
export default function RoleGuard(roles: string[], options?: RoleGuardOptions) {
  const strict: boolean = options?.strict !== undefined ? options?.strict : true;

  return async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req['user'] as CurrentUserType;
    const genericMsg = 'You do not have the permission to perform this operation';

    try {
      if (!currentUser) throw new ForbiddenError(genericMsg);

      if (!roles.includes(currentUser.role)) {
        throw new ForbiddenError(genericMsg);
      }

      next();
    } catch (error) {
      if (strict) {
        next(error);
      }

      next();
    }
  };
}
