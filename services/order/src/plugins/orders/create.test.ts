import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';
import mongoose from 'mongoose';
import { createProduct } from '../../test/setup';
import { AUTH_COOKIE_NAME, registerTestSession } from '@ecomtiago/common';
import { OrderStatus } from '../../models/order';

describe('order create', () => {
  let server: Hapi.Server | null = null;
  let authSession: string = '';

  beforeAll(async () => {
    server = await createServer();
    authSession = `${AUTH_COOKIE_NAME}=${registerTestSession({
      id: new mongoose.Types.ObjectId().toHexString(),
    })};`;
  });

  it('throws a 401 if not authenticated', () => {
    return request(server?.listener).post('/api/orders')
      .send({})
      .expect(401);
  });

  it('fails with invalid payload', async () => {
    return request(server?.listener).post('/api/orders')
      .send({ price: 42 })
      .set('Cookie', authSession)
      .expect(400);
  });

  it('throws an error message when some of the requested products do not exist', async () => {
    const productOneId = mongoose.Types.ObjectId();
    const res = await request(server?.listener).post('/api/orders')
      .send({
        products: [
          { id: productOneId, quantity: 1 },
          { id: mongoose.Types.ObjectId(), quantity: 1 }
        ]
      })
      .set('Cookie', authSession)
      .expect(400);

    expect(res.body.message).toEqual(`product ${productOneId} does not exist`);
  });

  it('throws an error message when some of the requested products do not have enough stock', async () => {
    const product = await createProduct({
      price: 42, quantity: 1, title: 'Some product',
    });

    const res = await request(server?.listener).post('/api/orders')
      .send({
        products: [
          { id: product.id, quantity: 2 },
        ]
      })
      .set('Cookie', authSession)
      .expect(400);

    expect(res.body.message).toEqual(`product ${product.id} does not have enough stock`);
  });

  it('successfully creates an order', async () => {
    const productOne = await createProduct({
      price: 42, quantity: 42, title: 'Some product 1',
    });
    const productTwo = await createProduct({
      price: 69, quantity: 100, title: 'Some product 2',
    });

    const res = await request(server?.listener).post('/api/orders')
      .send({
        products: [
          { id: productOne.id, quantity: 41 },
          { id: productTwo.id, quantity: 4 },
        ]
      })
      .set('Cookie', authSession)
      .expect(200);

    expect(res.body.status).toEqual(OrderStatus.Created);
    expect(res.body.products.length).toEqual(2);
  });

  it.todo('emits a "order:created" event');
})
