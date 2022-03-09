import {Model, ModelObject} from 'objection'

export class Token extends Model {
  id!: string;
  value?: string;
  type?: string;
  ownerId?: number;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  static tableName = 'tokens' // database table name
  static idColumn = 'id' // id column name
  
}

export type TokenShape = ModelObject<Token>