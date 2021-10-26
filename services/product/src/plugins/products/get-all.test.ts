import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';

describe('product get all', () => {
  let server: Hapi.Server | null = null;

  beforeAll(async () => {
    server = await createServer();
  });

  it('successfully gets all products', async () => {
    await request(server?.listener).post('/api/products')
      .send({ title: 'sample product', price: 42 })
      .expect(201);

    const res = await request(server?.listener).get('/api/products')
      .expect(200);
    expect(res.body.length).toEqual(1);
  });
})