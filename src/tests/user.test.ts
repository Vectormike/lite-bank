import request from 'supertest';
import setupTestDB from './util/setupDB';
import app from '../app';

setupTestDB();

describe('User and Authentication management', () => {
  it('should register a user and create an account', async (done) => {
    const res = await request(app).post(`/api/auth/register`).send({
      email: 'victorjonah199@gmail.com',
      password: 'Redeemer',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toEqual('victorjonah199@gmail.com');
    done();
  });

  it('should login a user', async (done) => {
    const res = await request(app).post(`/api/auth/login`).send({
      email: 'victorjonah199@gmail.com',
      password: 'Redeemer',
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Logged in successfully');
    done();
  });
});
