import { User } from '../user/user.model';
import { Model, ModelObject } from 'objection';

export class Transaction extends Model {
  id!: number;
  account_id: number;
  operation: string; // deposit, transfer, withdrawal
  reference: string;
  balance_before: number;
  balance_after: number;
  createdAt: Date;

  static tableName = 'transactions';
  static idColumn = 'id';

  static get relationMappings() {
    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'transactions.account_id',
          to: 'account.id',
        },
      },
    };
  }
}

export type TransactionShape = ModelObject<Transaction>;
