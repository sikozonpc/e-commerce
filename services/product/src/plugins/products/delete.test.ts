import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';
import mongoose from 'mongoose';
import { AUTH_COOKIE_NAME, registerTestSession } from '@ecomtiago/common';
import { natsWrapper } from '../../nats-wrapper';

describe('product delete', () => {
  let server: Hapi.Server | null = null;
  let authSession: string = '';

  beforeAll(async () => {
    server = await createServer();
    authSession = `${AUTH_COOKIE_NAME}=${registerTestSession({
      id: new mongoose.Types.ObjectId().toHexString(),
    })};`;
  });

  it('should fail to delete without auth', () => {
    return request(server?.listener).delete('/api/products/42')
      .expect(401);
  })

  it('should successfully delete a product', async () => {
    const { body: { id } } = await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42, quantity: 1 })
      .set('Cookie', authSession)
      .expect(201);

    return request(server?.listener).delete(`/api/products/${id}`)
      .set('Cookie', authSession)
      .expect(204);
  });

  it('should fails with invalid params', async () => {
    return request(server?.listener).delete('/api/products/12313')
      .set('Cookie', authSession)
      .expect(404);
  });


  it('should emit a "product:deleted" event', async () => {
    const { body: { id } } = await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42, quantity: 1 })
      .set('Cookie', authSession)
      .expect(201);

    await request(server?.listener).delete(`/api/products/${id}`)
      .set('Cookie', authSession)
      .expect(204);

    // should be called once for the POST and one for the DELETE
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  });
})