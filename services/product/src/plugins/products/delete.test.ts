import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';

describe('product delete', () => {
  let server: Hapi.Server | null = null;

  beforeAll(async () => {
    server = await createServer();
  });

  it('successfully deletes a product', async () => {
    const { body: { id } } = await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42 })
      .expect(201);

    return request(server?.listener).delete(`/api/products/${id}`)
      .expect(204);
  });

  it.todo('fails to delete without authentication');

  it('fails with invalid params', async () => {
    return request(server?.listener).delete('/api/products/12313')
      .expect(404);
  });

  it.todo('emits a "product:delete" event');
})