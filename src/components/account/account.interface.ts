export interface IAccount {
  id?: number;
  accountNumber: string;
  user_id: number;
  balance?: number;
  createdAt?: Date;
}

export interface FundAccountRequest {
  accountNumber: string;
  amount: number;
}

export interface TransferRequest {
  senderAccountNumber: string; // sender account number
  receiverAccountNumber: string; // destination account number
  amount: number;
}

export interface WithdrawAccountRequest {
  accountNumber: string;
  amount: number;
}
