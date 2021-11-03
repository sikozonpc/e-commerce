import request from 'supertest';
import Hapi from '@hapi/hapi';
import { createServer } from '../../server';

describe('auth register', () => {
  let server: Hapi.Server | null = null;

  beforeAll(async () => {
    server = await createServer();
  });

  it('should register a user', async () => {
    const res = await request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(200);
    
    expect(res.body.id).not.toBeNull();
  });

  it('should fail with invalid payload', async () => {
    return request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'a' })
      .expect(400);
  });

  it('should set the cookie after successfull register', async () => {
    const res = await request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  })

  it('should fail if a user already exists', async () => {
    await request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(200);
    
    return request(server?.listener).post('/api/auth/register')
      .send({ username: 'sample-user123', password: 'asd' })
      .expect(409);
  });
})