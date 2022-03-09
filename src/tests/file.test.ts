import request from 'supertest';
import setupTestDB from './util/setupDB';
import { fileOne, fileTwo, insertFiles } from '../tests/fixtures/file.fixtures';
import app from '../app';
import dotenv from 'dotenv';
dotenv.config();

// const BASE_URL = `http://localhost:8000`;

const filePath = `${__dirname}/testfile.png`;

setupTestDB();

describe('File Upload', () => {
  //   it('should upload a file', async (done) => {
  //     const res = await request('http://localhost:8000').post(`/api/file/upload`).send({
  //       file: filePath,
  //       user_id: 1,
  //     });
  //     console.log('STATUS_RES', res.body);
  //     expect(res.status).toBe(201);
  //     // expect(res.body.data.email).toEqual('victorjonah199@gmail.com');
  //     done();
  //   });

  it('should not download a file unless authorized', async (done) => {
    await insertFiles([fileOne]);
    await request(app).get(`/api/file/download/${fileOne.id}`).expect(401);
    done();
  });

  it('should mark a file unsafe', async (done) => {
    await insertFiles([fileTwo]);
    const res = await request(app).patch(`/api/file/mark-unsafe/${fileTwo.id}`).send();
    console.log(res);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('File successfully marked unsafe');

    done();
  });
});
