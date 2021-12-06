import request from 'supertest';
import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
import { createServer } from '../../server';
import { AUTH_COOKIE_NAME, registerTestSession } from '@ecomtiago/common';

describe('product update', () => {
  let server: Hapi.Server | null = null;
  let authSession: string = '';

  beforeAll(async () => {
    server = await createServer();
    authSession = `${AUTH_COOKIE_NAME}=${registerTestSession({
      id: new mongoose.Types.ObjectId().toHexString(),
    })};`;
  });

  it('should fail without auth', () => {
    return request(server?.listener).patch('/api/products/some-id')
      .send({ price: 42 })
      .expect(401);
  });

  it('should successfully update a product', async () => {
    const res = await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42, quantity: 2 })
      .set('Cookie', authSession)
      .expect(201);

    const { body } = await request(server?.listener).patch(`/api/products/${res.body.id}`)
      .send({
        title: 'updated product title',
        price: 69,
        quantity: 420,
      })
      .set('Cookie', authSession)
      .expect(200);

    expect(body.title).toEqual('updated product title');
    expect(body.quantity).toEqual(420);
    expect(body.price).toEqual(69);
  });

  it('should fail with invalid payload', async () => {
    return request(server?.listener).patch('/api/products/some-id')
      .send({ price: '42' })
      .set('Cookie', authSession)
      .expect(400);
  });

  it.todo('should emit a "product:updated" event');
})