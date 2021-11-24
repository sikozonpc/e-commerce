import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';
import mongoose from 'mongoose';
import { AUTH_COOKIE_NAME, registerTestSession } from '@ecomtiago/common';
import { createProduct } from '../../test/setup';


describe('order get all', () => {
  let server: Hapi.Server | null = null;
  let authSession: string = '';

  beforeAll(async () => {
    server = await createServer();
    authSession = `${AUTH_COOKIE_NAME}=${registerTestSession({
      id: new mongoose.Types.ObjectId().toHexString(),
    })};`;
  });

  it('throws a 401 if not authenticated', () => {
    return request(server?.listener).get('/api/orders')
      .send({})
      .expect(401);
  });

  it('should return the user\'s orders', async () => {
    const productOne = await createProduct({
      id: mongoose.Types.ObjectId().toString(),
      price: 42, quantity: 3, title: 'Some product 1',
    });

    const createOrderRes = await request(server?.listener).post('/api/orders')
      .send({
        products: [
          { id: productOne.id, quantity: 2 }
        ]
      })
      .set('Cookie', authSession)
      .expect(200);

    const res = await request(server?.listener).get('/api/orders')
      .set('Cookie', authSession)
      .expect(200);

    expect(res.body[0].id).toEqual(createOrderRes.body.id);
  });
})
