import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '../../errors';
import { Account } from './account.model';
import { ServiceMethodOptions } from '../../shared/types/ServiceMethodOptions';
import logger from '../../logger';
import { FundAccountRequest, IAccount, TransferRequest, WithdrawAccountRequest } from './account.interface';
import { Transaction } from '../../components/transaction/transaction.model';
import { v4 } from 'uuid';
import { knex } from '../../config/database';
import { Knex } from 'knex';

export class AccountService {
  constructor(private readonly accountModel = Account, private readonly transactionModel = Transaction) {}

  private async debitAccount(accountNumber: string, amount: number, reference: any, purpose: string, transaction: Knex.Transaction<any, any[]>) {
    try {
      // Check if account exists
      const accountExists = await this.accountModel.query(transaction).findOne({ accountNumber: accountNumber });

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

      let newAmount: number;
      newAmount = Number(accountExists.balance) - Number(amount);

      await this.accountModel.query().patch({ balance: newAmount }).where({ id: accountExists.id });

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

  private async creditAccount(accountNumber: string, amount: number, transaction: Knex.Transaction<any, any[]>) {
    const reference = v4();
    const purpose = 'deposit';

    try {
      const accountExists = await this.accountModel.query().findOne({ accountNumber });
      if (!accountExists) {
        logger.info('Account does not exist');
        throw new NotFoundError('Account does not exist');
      }

      let newAmount: number;
      newAmount = Number(accountExists.balance) + Number(amount);

      // Update balance
      const resp = await this.accountModel.query(transaction).update({ balance: newAmount }).where({ id: accountExists.id });
      console.log(resp);

      // Create a transaction for this deposit
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
        message: 'Credit successful',
      };
    } catch (error) {
      logger.info(JSON.stringify(error));
      await transaction.rollback();
      return {
        success: false,
        error: 'Internal Server Error',
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
      const creditResult = await this.creditAccount(body.accountNumber, body.amount, transaction);

      console.log(creditResult);

      if (creditResult.success === false) {
        await transaction.rollback();
        throw new Error();
      }

      return {
        success: true,
        message: 'Deposit successful',
      };
    } catch (error) {
      logger.info(JSON.stringify('Unable to fund...', error));
      await transaction.rollback();
      return {
        success: false,
        error: 'Internal Server Error',
      };
    }
  }

  /**
   * @param {number} account_number account_number of the account(User)
   * @param {number} amount amount to deposit
   */
  async transferFund(body: TransferRequest, options?: ServiceMethodOptions): Promise<any> {
    const transaction = await knex.transaction();

    const reference = v4();
    const purpose = 'transfer';
    try {
      // Check if recipient's account exists
      const accountExists = await this.accountModel.query(transaction).findOne({ accountNumber: body.senderAccountNumber });
      if (!accountExists) {
        logger.info('Account does not exist');
        throw new NotFoundError('Account does not exist');
      }

      // Debit sender and credit recipient's account concurrently
      const transferResponse = await Promise.all([
        this.debitAccount(body.senderAccountNumber, body.amount, reference, purpose, transaction),
        this.creditAccount(body.receiverAccountNumber, body.amount, transaction),
      ]);

      const failedTransaction = transferResponse.filter((response) => response.success === false);
      if (failedTransaction.length) {
        await transaction.rollback();
        throw new Error();
      }

      await transaction.commit();

      return {
        success: true,
        message: 'Transfer successful',
      };
    } catch (error) {
      logger.info(JSON.stringify('Unable to transfer...', error));
      await transaction.rollback();
      return {
        success: false,
        error: 'Internal Server Error',
      };
    }
  }

  /**
   * @param {number} account_number account_number of the account(User)
   * @param {number} amount amount to deposit
   */
  async withdrawFund(body: WithdrawAccountRequest): Promise<any> {
    const transaction: Knex.Transaction = await knex.transaction();
    const reference = v4();
    const purpose = 'withdrawal';
    try {
      const debitResponse = await this.debitAccount(body.accountNumber, body.amount, reference, purpose, transaction);
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
      logger.info(JSON.stringify('Unable to withdraw...', error));
      await transaction.rollback();
      return {
        success: false,
        error: 'Internal Server Error',
      };
    }
  }
}
