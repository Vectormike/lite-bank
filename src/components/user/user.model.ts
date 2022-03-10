import { Model, ModelObject } from 'objection';

export class User extends Model {
  id!: number;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'users'; // database table name
  static idColumn = 'id'; // id column name

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    delete json.createAt;
    delete json.updatedAt;
    delete json.role;
    return json;
  }

  static get relationMappings() {
    return {
      account: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'account.accountNumber',
          to: 'users.id',
        },
      },
    };
  }
}

export type UserShape = ModelObject<User>;
