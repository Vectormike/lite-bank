import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '../../errors';
import { Account } from './account.model';
import { ServiceMethodOptions } from '../../shared/types/ServiceMethodOptions';
import logger from '../../logger';
import { FundAccountRequest, IAccount, TransferRequest, WithdrawAccountRequest } from './account.input';
import { knex } from 'config/database';
import { Transaction } from 'components/transaction/transaction.model';
import { v4 } from 'uuid';
import { Knex } from 'knex';
import { response } from 'express';

export class AccountService {
  constructor(private readonly accountModel = Account, private readonly transactionModel = Transaction) {}

  private async debitAccount(account_id: number, amount: number, reference: any, purpose: string, transaction: any) {
    try {
      // Check if account exists
      const accountExists = await this.accountModel.query(transaction).findOne({ id: account_id });
      if (!accountExists) {
        logger.info('Account does not exist');
        throw new NotFoundError('Account does not exist');
      }

      // Check if balance is sufficient
      if (Number(accountExists.balance) < amount) {
        return {
          success: false,
          error: 'Insufficient balance',
        };
      }

      await this.accountModel.query(transaction).update({ balance: -amount }).where({ id: account_id });

      await this.transactionModel.query(transaction).insert({
        account_id: accountExists.id,
        operation: purpose,
        reference,
        balance_before: Number(accountExists.balance),
        balance_after: Number(accountExists.balance) + Number(amount),
      });

      await transaction.commit();

      return {
        success: true,
        message: 'Debit successful',
      };
    } catch (error) {
      logger.info(JSON.stringify(error));
      await transaction.rollback();
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }

  async createAccount(body: IAccount, transaction: Knex.Transaction<any, any[]>): Promise<any> {
    try {
      const account = await this.accountModel.query(transaction).insert({
        accountNumber: body.accountNumber,
        user_id: body.user_id,
      });
      if (!account) {
        logger.info('Unable to create account');
        await transaction.rollback();
      }
    } catch (error) {
      logger.info(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * @param {number} account_number account_number of the account(User)
   * @param {number} amount amount to deposit
   */
  async fundAccount(body: FundAccountRequest): Promise<any> {
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
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }

  /**
   * @param {number} account_number account_number of the account(User)
   * @param {number} amount amount to deposit
   */
  async transferFund(body: TransferRequest, options?: ServiceMethodOptions): Promise<any> {
    const transaction: Knex.Transaction = await knex.transaction();
    const reference = v4();
    const purpose = 'transfer';
    try {
      const account = await this.accountModel.query(transaction).findOne({ user_id: options.currentUser.id });
      const transferResponse = await Promise.all([this.debitAccount(account.id, body.amount, reference, purpose, transaction), this.fundAccount(body)]);

      const failedTransaction = transferResponse.filter((response) => !response);
      if (failedTransaction.length) {
        await transaction.rollback();
        return;
      }

      await transaction.commit();

      return {
        success: true,
        message: 'Transfer successful',
      };
    } catch (error) {
      logger.info(JSON.stringify(error));
      await transaction.rollback();
      return {
        success: false,
        error: 'Unable to Transfer',
      };
    }
  }

  /**
   * @param {number} account_number account_number of the account(User)
   * @param {number} amount amount to deposit
   */
  async withdrawFund(body: WithdrawAccountRequest, options?: ServiceMethodOptions): Promise<any> {
    const transaction: Knex.Transaction = await knex.transaction();
    const reference = v4();
    const purpose = 'withdrawal';
    try {
      // Get account ID
      const account = await this.accountModel.query(transaction).findOne({ accountNumber: body.accountNumber });
      if (!account) {
        logger.info('Account does not exist');
        throw new NotFoundError('Account does not exist');
      }
      const debitResponse = await this.debitAccount(account.id, body.amount, reference, purpose, transaction);
      if (!debitResponse) {
        logger.info('Unable to withdraw');
        await transaction.rollback();
      }

      await transaction.commit();
      return {
        success: true,
        message: 'Withdrawal successful',
      };
    } catch (error) {
      logger.info(JSON.stringify(error));
      await transaction.rollback();
      return {
        success: false,
        error: 'Unable to withdraw',
      };
    }
  }
}
