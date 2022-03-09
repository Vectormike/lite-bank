import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { CurrentUserType } from '../../shared/types/CurrentUser';
import { AuthService } from './auth.service';


export interface IAuthController {
    register: RequestHandler,
    login: RequestHandler,
    changePassword: RequestHandler,
    generateToken: RequestHandler,
    logout: RequestHandler,
}

export function AuthControllerFactory(authService: AuthService): IAuthController {
  return {
  
    /**
     * Signs up a new user
     */
    async register(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<any> {
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
        logger.info(JSON.stringify(error))
        next(error);
      }
    },
  
   
  
    /**
     * Attempts to log in a user
     */
    async login(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<any> {
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
        logger.info(JSON.stringify(error))
        next(error);
      }
    },
  
    /**
   * Attempts to log in a user
   */
    async changePassword(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<any> {
      const { body } = req;
      const user = req['user'] as CurrentUserType;

      try {
        await authService.changePassword({ ...body, userId: user.id });
  
        return res.status(httpStatus.OK).json({
          message: 'Password was changed successfully',
          status: 'success',
          statusCode: httpStatus.OK,
        });
      } catch (error) {
        logger.info(JSON.stringify(error))
        next(error);
      }
    },
    

  
    /**
     * Generate refresh token
     */
     async generateToken(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<any> {
      const { body } = req;
      try {
        const loginInfo = await authService.generateNewRefreshToken(body.refreshToken);
    
        return res.status(200).json({
          message: 'Successfully renewed session',
          status: 'success',
          statusCode: httpStatus.OK,
          data: loginInfo
        })
      } catch(error) {
        logger.info(JSON.stringify(error))
        next(error);
      }
    },
  
    /**
     * Logout a user
     * @param {Object} req: url params
     * @param {Function} res: Express.js response callback
     * @param {Function} next: Express.js middleware callback
     * @author Emmanuel Ogbiyoyo
     * @public
     */
    async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
      try {
        const { refreshToken } = req.body;
  
        await authService.logout(refreshToken);
  
        return res.status(httpStatus.OK).send({
          message: "Successfully logged out",
          statusCode: httpStatus.OK,
          status: "success",
        });
      } catch (error) {
        logger.info(JSON.stringify(error))
        next(error);
      }
    }
  }
}
