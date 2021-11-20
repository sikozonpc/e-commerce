import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';
import mongoose from 'mongoose';
import { AUTH_COOKIE_NAME, registerTestSession } from '@ecomtiago/common';
import { createProduct } from '../../test/setup';


describe('order get one', () => {
  let server: Hapi.Server | null = null;
  let authSession: string = '';

  beforeAll(async () => {
    server = await createServer();
    authSession = `${AUTH_COOKIE_NAME}=${registerTestSession({
      id: new mongoose.Types.ObjectId().toHexString(),
    })};`;
  });

  it('throws a 401 if not authenticated', () => {
    return request(server?.listener).get('/api/orders/42')
      .send({})
      .expect(401);
  });

  it('should return the user\'s order by ID', async () => {
    const productOne = await createProduct({
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

    const res = await request(server?.listener).get(`/api/orders/${createOrderRes.body.id}`)
      .set('Cookie', authSession)
      .expect(200);

    expect(res.body.id).toEqual(createOrderRes.body.id);
  });

  it('should return 404 if the order does not exist', async () => {
    return request(server?.listener).get(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`)
      .set('Cookie', authSession)
      .expect(404);
  })
})
