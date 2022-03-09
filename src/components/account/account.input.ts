export interface IAccount {
  id?: number;
  accountNumber: string;
  name: string;
  balance: number;
  createdAt?: Date;
}

export interface FundAccountRequest {
  accountNumber: string;
  amount: number;
}

export interface TransferRequest {
  senderAccountNumber: string; // sender's account number
  recipientAccountNumber: string; // destination account number
  amount: number;
}

export interface WithdrawAccountRequest {
  accountNumber: string;
  amount: number;
}
