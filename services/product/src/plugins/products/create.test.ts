import request from 'supertest';
import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
import { createServer } from '../../server';
import { AUTH_COOKIE_NAME, registerTestSession } from '@ecomtiago/common';
import { natsWrapper } from '../../nats-wrapper';

describe('product create', () => {
  let server: Hapi.Server | null = null;
  let authSession: string = '';

  beforeAll(async () => {
    server = await createServer();
    authSession = `${AUTH_COOKIE_NAME}=${registerTestSession({
      id: new mongoose.Types.ObjectId().toHexString(),
    })};`;
  });

  it('should fail without auth', () => {
    return request(server?.listener).post('/api/products')
      .send({ price: 42 })
      .expect(401);
  });

  it('should successfully create a product', async () => {
    const res = await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42, quantity: 2 })
      .set('Cookie', authSession)
      .expect(201);
    expect(res.body.id).not.toBeNull();
  });

  it('should fail with invalid payload', async () => {
    return request(server?.listener).post('/api/products')
      .send({ price: 42 })
      .set('Cookie', authSession)
      .expect(400);
  });

  it('should emit a "product:created" event', async () => {
    await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42, quantity: 2 })
      .set('Cookie', authSession)
      .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  });
})