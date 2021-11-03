import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';

describe('order create', () => {
  let server: Hapi.Server | null = null;

  beforeAll(async () => {
    server = await createServer();
  });

  it('successfully creates an order', async () => {
    const res = await request(server?.listener).post('/api/orders')
      .send({ title: 'sample order', price: 42 })
      .expect(201);
    expect(res.body.id).not.toBeNull();
  });

  it.todo('fails to create without authentication');

  it('fails with invalid payload', async () => {
    return request(server?.listener).post('/api/orders')
      .send({ price: 42 })
      .expect(400);
  });

  it.todo('emits a "order:created" event');
})
