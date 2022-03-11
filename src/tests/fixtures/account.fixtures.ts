import { Account } from '../../components/account/account.model';

const accountOne = {
  user_id: 1,
  accountNumber: 1808624972,
  balance: 0,
};

const accountTwo = {
  user_id: 2,
  accountNumber: 1808624973,
  balance: 0,
};

const insertAccounts = async (accounts: any) => {
  await Account.query().insert(accounts.map((account: any) => account));
};

export { accountOne, accountTwo, insertAccounts };
