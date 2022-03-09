import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import logger from '../../logger';
import { AccountService } from './account.service';

export interface IAccountController {
  fundAccount: RequestHandler;
  transferFund: RequestHandler;
  withdrawFund: RequestHandler;
}

export function AccountControllerFactory(accountService: AccountService): IAccountController {
  return {
    async fundAccount(req: Request, res: Response, next: NextFunction): Promise<any> {
      try {
        const { user } = req;
        const uploadedFile = await accountService.fundAccount();
        logger.info(JSON.stringify(uploadedFile));
        return res.status(httpStatus.OK).json({
          message: 'File successfully uploaded',
          status: 'success',
          statusCode: httpStatus.CREATED,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async transferFund(req: Request, res: Response, next: NextFunction): Promise<any> {
      try {
        const { user, body,params:{id}, } = req;
        const uploadedFile = await accountService.transferFund();
        logger.info(JSON.stringify(uploadedFile));
        return res.status(httpStatus.OK).json({
          message: 'File successfully uploaded',
          status: 'success',
          statusCode: httpStatus.CREATED,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async withdrawFund(req: Request, res: Response, next: NextFunction): Promise<any> {
      try {
        const {
          user,
          params: { id },
        } = req;
        const fileInstance = await accountService.withdrawFund(id, { currentUser: user });
        logger.info(JSON.stringify(fileInstance));
        return res.status(httpStatus.OK).json({
          message: 'File successfully uploaded',
          status: 'success',
          statusCode: httpStatus.CREATED,
          data: fileInstance,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    
}
