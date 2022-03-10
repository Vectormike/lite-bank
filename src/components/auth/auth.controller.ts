import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { CurrentUserType } from '../../shared/types/CurrentUser';
import { AuthService } from './auth.service';

export interface IAuthController {
  register: RequestHandler;
  login: RequestHandler;
}

export function AuthControllerFactory(authService: AuthService): IAuthController {
  return {
    /**
     * Signs up a new user
     */
    async register(req: Request, res: Response, next: NextFunction): Promise<any> {
      const { body } = req;

      try {
        const user = await authService.register(body);

        return res.status(httpStatus.CREATED).json({
          message: 'User account was created successfully.',
          status: 'success',
          statusCode: httpStatus.CREATED,
          data: user,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    /**
     * Attempts to log in a user
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<any> {
      const { body } = req;

      try {
        const loginData = await authService.login(body);

        return res.status(httpStatus.OK).json({
          message: 'Logged in successfully',
          status: 'success',
          statusCode: httpStatus.OK,
          data: loginData,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },
  };
}
