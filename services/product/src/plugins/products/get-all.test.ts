import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';
import mongoose from 'mongoose';
import { AUTH_COOKIE_NAME, registerTestSession } from '@ecomtiago/common';

describe('product get all', () => {
  let server: Hapi.Server | null = null;
  let authSession: string = '';

  beforeAll(async () => {
    server = await createServer();
    authSession = `${AUTH_COOKIE_NAME}=${registerTestSession({
      id: new mongoose.Types.ObjectId().toHexString(),
    })};`;
  });

  it('successfully gets all products', async () => {
    await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42, quantity: 4 })
      .set('Cookie', authSession)
      .expect(201);

    const res = await request(server?.listener).get('/api/products')
      .expect(200);
    expect(res.body.length).toEqual(1);
  });
});
