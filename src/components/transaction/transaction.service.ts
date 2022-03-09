import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '../../errors';
import { Transaction } from './transaction.model';
import { ServiceMethodOptions } from '../../shared/types/ServiceMethodOptions';
import logger from '../../logger';

export class AccountService {
  constructor(private readonly transactionModel = Transaction) {}

  async createTransaction(file: any, options?: ServiceMethodOptions): Promise<any> {
    try {
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }
}
