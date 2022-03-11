import request from 'supertest';
import setupTestDB from './util/setupDB';
import { accountOne, accountTwo, insertAccounts } from './fixtures/account.fixtures';
import app from '../app';

setupTestDB();

describe('Account', () => {
  it('should fund my account', async (done) => {
    await insertAccounts([accountOne]);
    const res = await request(app).post(`/api/account/deposit`).send({
      accountNumber: '1808624972',
      amount: 1000,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Deposit successful');
    done();
  });

  it('should transfer to another account', async (done) => {
    await insertAccounts([accountOne, accountTwo]);
    const res = await request(app).post(`/api/account/transfer`).send({ senderAccountNumber: '1808624972', receiverAccountNumber: '1808624973', amount: 1000 });
    expect(res.body.message).toEqual('Transfer successful');
    expect(res.status).toBe(200);
    done();
  });

  it('should withdraw from my account', async (done) => {
    await insertAccounts([accountOne]);
    const res = await request(app).post(`/api/account/withdraw`).send({ accountNumber: '1808624972', amount: 1000 });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Withdrawal successful');
    done();
  });
});
