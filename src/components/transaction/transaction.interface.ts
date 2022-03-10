export interface ITransaction {
  id?: number;
  account_id: number;
  operation: string; // deposit, transfer
  reference: string;
  createdAt?: Date;
}
