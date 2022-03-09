import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '../../errors';
import { Account } from './account.model';
import { ServiceMethodOptions } from '../../shared/types/ServiceMethodOptions';
import logger from '../../logger';
import { FundAccountRequest } from './account.input';
import { knex } from 'config/database';
import { Transaction } from 'components/transaction/transaction.model';
import { v4 } from 'uuid';

export class AccountService {
  constructor(private readonly accountModel = Account, private readonly transactionModel = Transaction) {}

  async createAccount(body: any, transaction): Promise<any> {
    try {
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * @param {number} account_number account_number of the account(User)
   * @param {number} amount amount to deposit
   */
  async fundAccount(body: FundAccountRequest, options?: ServiceMethodOptions): Promise<any> {
    const transaction = await knex.transaction();

    try {
      const accountExists = await this.accountModel.query(transaction).findOne({ accountNumber: body.accountNumber });
      if (!accountExists) {
        logger.info('Account does not exist');
        throw new NotFoundError('Account does not exist');
      }

      accountExists.balance += body.amount;
      await this.accountModel
        .query(transaction)
        .update({
          balance: ++body.amount,
        })
        .where({ id: accountExists.id });

      await this.transactionModel.query(transaction).insert({
        account_id: accountExists.id,
        operation: 'deposit',
        reference: v4(),
        balance_before: Number(accountExists.balance),
        balance_after: Number(accountExists.balance) + Number(body.amount),
      });

      await transaction.commit();

      return {
        success: true,
        message: 'Deposit successful',
      };
    } catch (error) {
      logger.info(JSON.stringify(error));
      await transaction.rollback();
      throw error;
    }
  }

  async transferFund(body: any, file: any, options?: ServiceMethodOptions): Promise<any> {
    try {
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  async withdrawFund(id: string, options?: ServiceMethodOptions): Promise<any> {
    try {
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }
}
