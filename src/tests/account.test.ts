import request from 'supertest';
import setupTestDB from './util/setupDB';
// import { fileOne, fileTwo, insertFiles } from './fixtures/file.fixtures';
import app from '../app';
import dotenv from 'dotenv';
dotenv.config();

setupTestDB();

describe('Account', () => {
  it('should fund my account', async (done) => {
    const res = await request(app).post(`/api/account/deposit`).send({
      accountNumber: '',
      amount: 1000,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Deposit successful');
    done();
  });

  it('should transfer to another account', async (done) => {
    // await insertFiles([fileOne]);
    const res = await request(app).post(`/api/account/transfer`).send({ accountNumber: '', amount: 1000 }).expect(200);
    expect(res.body.message).toEqual('Transfer successful');
    done();
  });

  it('should withdraw from my account', async (done) => {
    // await insertFiles([fileTwo]);
    const res = await request(app).post(`/api/account/withdraw`).send({ accountNumber: '', amount: 1000 }).expect(200);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Withdrawal successful');
    done();
  });
});
