import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';
import mongoose from 'mongoose';
import { AUTH_COOKIE_NAME, registerTestSession } from '@ecomtiago/common';

describe('product delete', () => {
  let server: Hapi.Server | null = null;
  let authSession: string = '';

  beforeAll(async () => {
    server = await createServer();
    authSession = `${AUTH_COOKIE_NAME}=${registerTestSession({
      id: new mongoose.Types.ObjectId().toHexString(),
    })};`;
  });

  it('fails to delete without auth', () => {
    return request(server?.listener).delete('/api/products/42')
      .expect(401);
  })

  it('successfully deletes a product', async () => {
    const { body: { id } } = await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42 })
      .set('Cookie', authSession)
      .expect(201);

    return request(server?.listener).delete(`/api/products/${id}`)
      .set('Cookie', authSession)
      .expect(204);
  });

  it('fails with invalid params', async () => {
    return request(server?.listener).delete('/api/products/12313')
      .set('Cookie', authSession)
      .expect(404);
  });

  it.todo('emits a "product:delete" event');
})