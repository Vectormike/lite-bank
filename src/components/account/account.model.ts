import { User } from '../user/user.model';
import { Model, ModelObject } from 'objection';

export class Account extends Model {
  id!: number;
  user_id: number;
  accountNumber: string;
  balance: number;
  createdAt: Date;

  static tableName = 'accounts';
  static idColumn = 'id';

  //   static get relationMappings() {
  //     return {
  //         user: {
  //             relation: Model.BelongsToOneRelation,
  //             modelClass: User,
  //             join: {
  //                 from: 'questions.author_id',
  //                 to: 'users.id'
  //             }
  //         }
  //     }
  //   }
}

export type AccountShape = ModelObject<Account>;
