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
        const account = await accountService.fundAccount(req.body);
        logger.info(JSON.stringify(account));
        return res.status(httpStatus.OK).json({
          data: account,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async transferFund(req: Request, res: Response, next: NextFunction): Promise<any> {
      try {
        const { user, body } = req;
        const account = await accountService.transferFund(body, { currentUser: user });
        logger.info(JSON.stringify(account));
        return res.status(httpStatus.OK).json({
          data: account,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },

    async withdrawFund(req: Request, res: Response, next: NextFunction): Promise<any> {
      try {
        const { user, body } = req;
        const account = await accountService.withdrawFund(body);
        logger.info(JSON.stringify(account));
        return res.status(httpStatus.OK).json({
          data: account,
        });
      } catch (error) {
        logger.info(JSON.stringify(error));
        next(error);
      }
    },
  };
}
