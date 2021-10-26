import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';

describe('product create', () => {
  let server: Hapi.Server | null = null;

  beforeAll(async () => {
    server = await createServer();
  });

  it('successfully creates a product', async () => {
    const res = await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42 })
      .expect(201);
    expect(res.body.id).not.toBeNull();
  });

  it.todo('fails to create without authentication');

  it('fails with invalid payload', async () => {
    return request(server?.listener).post('/api/products')
      .send({ price: 42 })
      .expect(400);
  });

  it.todo('emits a "product:create" event');
})